package main

import (
	"database/sql"
	_ "github.com/lib/pq"
	"github.com/paulmach/go.geojson"
	"golang.org/x/crypto/bcrypt"
	"io"
)

// LoginUser checks bcrypt hashed passwords match in the users table
func (pg *Postgres) LoginUser(u User) bool {
	var pass string
	err := pg.QueryRow("SELECT password_hash FROM users WHERE email = $1", u.Email).Scan(&pass)
	if err != nil {
		return false
	}

	// Check the stored hash with the supplied one
	err = bcrypt.CompareHashAndPassword([]byte(pass), []byte(u.Password))
	if err != nil {
		return false
	}

	return true
}

// CreateUser Creates a new user in the users table
func (pg *Postgres) CreateUser(u User) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)

	_, err = pg.Exec("INSERT INTO users(email, password_hash) VALUES($1,$2) RETURNING id", u.Email, hash)
	if err != nil {
		return err
	}
	return nil
}

// DeleteUser takes a user and removes it from pg
func (pg *Postgres) DeleteUser(u User) error {
	_, err := pg.Exec("DELETE FROM users WHERE email = $1", u.Email)
	if err != nil {
		return err
	}
	return nil
}

// FindRecipients handle the actual PostGIS query
// looking for all addresses inside the alert geometry
func (pg *Postgres) FindRecipients(geo *geojson.Geometry) ([]AlertRecipient, error) {
	var recipients []AlertRecipient
	json, err := geo.MarshalJSON()
	if err != nil {
		return nil, err
	}

	// Look for the phone numbers that having addresses in the alert geometry
	// Right now we assume the GeoJSON geometry is a polygon
	query := `
	   SELECT DISTINCT u.email, p.phone, p.alert_phone, p.alert_email, p.urgent_only
	   FROM Addresses a, Profiles p, Users u
	   WHERE ST_Intersects(a.point, ST_SetSRID(ST_GeomFromGeoJSON($1),4326))
	   AND a.profile_id = p.id AND p.user_id = u.id`

	// TODO total number of people
	/*
		queryPeople := `
		SELECT COUNT(u) FROM Users u, Addresses a, Profiles p
		WHERE ST_Intersects(a.point, ST_SetSRID(ST_GeomFromGeoJSON($1),4326))
		AND a.profile_id = p.id AND p.user_id = u.id
		`
	*/

	rows, err := pg.Query(query, json)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var recipient AlertRecipient
		err = rows.Scan(&recipient.Email,
			&recipient.Profile.Phone,
			&recipient.Profile.AlertEmail,
			&recipient.Profile.AlertPhone,
			&recipient.Profile.UrgentEmergenciesOnly,
		)
		recipients = append(recipients, recipient)
	}
	if err != nil {
		return nil, err

	}

	return recipients, nil
}

// FetchAlertHistory returns a slice of all alerts
func (pg *Postgres) FetchAlertHistory() ([]SentAlert, error) {
	sentAlerts := make([]SentAlert, 0)
	rows, err := pg.Query(`
SELECT message,
sent_sms,
sent_email,
sent_people,
sender,
severity,
ST_AsGeoJSON(geo) AS geojson
FROM sent_alerts;
`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var sentSMS, sentEmail, sentPeople int
		var message, sender, severity, json string
		err = rows.Scan(&message,
			&sentSMS,
			&sentEmail,
			&sentPeople,
			&sender,
			&severity,
			&json,
		)
		if err != nil {
			return nil, err
		}

		g, err := geojson.UnmarshalGeometry([]byte(json))
		if err != nil {
			return nil, err
		}
		f := geojson.NewFeature(g)
		s := SentAlert{
			Message:    message,
			SentSMS:    sentSMS,
			SentEmail:  sentEmail,
			SentPeople: sentPeople,
			Sender:     sender,
			Severity:   severity,
			Geo:        f,
		}
		sentAlerts = append(sentAlerts, s)
	}
	err = rows.Err()
	switch {
	case err == sql.ErrNoRows:
		return sentAlerts, nil
	case err != nil:
		return nil, err
	default:
		return sentAlerts, nil
	}
}

// FetchProfile fetches a profile from the DB.
func (pg *Postgres) FetchProfile(email string) (Profile, error) {
	var profile Profile
	row := pg.QueryRow(`
SELECT p.id, p.phone, p.alert_phone, p.alert_email, p.urgent_only
FROM profiles AS p, users AS u
WHERE p.user_id = u.id AND u.email = $1`, email)
	var phone string
	var profileID int32
	var alertPhone, alertEmail, urgentOnly bool
	err := row.Scan(&profileID,
		&phone,
		&alertPhone,
		&alertEmail,
		&urgentOnly)
	switch {
	case err == sql.ErrNoRows:
		profile.Phone = ""
	case err != nil:
		return Profile{}, err
	default:
		profile.Phone = phone
		profile.AlertEmail = alertEmail
		profile.AlertPhone = alertPhone
		profile.UrgentEmergenciesOnly = urgentOnly
		profile.Addresses = make([]ProfileAddress, 0)
	}
	rows, err := pg.Query(`
SELECT addresses.address,
ST_X(addresses.point) AS longitude,
ST_Y(addresses.point) AS latitude
FROM addresses, profiles, users
WHERE addresses.profile_id = profiles.id
AND profiles.user_id = users.id
AND users.email=$1;`, email)
	if err != nil {
		return Profile{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var address string
		var longitude, latitude float64
		err = rows.Scan(&address, &longitude, &latitude)
		if err != nil {
			return Profile{}, err
		}
		addy := ProfileAddress{address, latitude, longitude}
		profile.Addresses = append(profile.Addresses, addy)
	}
	err = rows.Err()
	switch {
	case err == sql.ErrNoRows:
		return profile, nil
	case err != nil:
		return profile, err
	default:
		return profile, nil
	}
}

// WriteProfile writes a Profile into the db.
func (pg *Postgres) WriteProfile(email string, profile Profile) error {
	tx, err := pg.Begin()
	if err != nil {
		return err
	}
	_, err = tx.Exec(`
DELETE FROM addresses USING users, profiles
WHERE addresses.profile_id = profiles.id
AND profiles.user_id = users.id
AND users.email = $1`, email)
	if err != nil {
		tx.Rollback()
		return err
	}
	_, err = tx.Exec(`
DELETE FROM profiles USING users
WHERE profiles.user_id = users.id
AND users.email = $1`, email)
	if err != nil {
		tx.Rollback()
		return err
	}
	var userID int32
	row := tx.QueryRow("SELECT id FROM users WHERE email = $1", email)
	err = row.Scan(&userID)
	if err != nil {
		tx.Rollback()
		return err
	}
	var profileID int32
	row = tx.QueryRow(`
INSERT INTO profiles (user_id, phone, alert_phone, alert_email, urgent_only)
VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		userID,
		profile.Phone,
		profile.AlertPhone,
		profile.AlertEmail,
		profile.UrgentEmergenciesOnly,
	)
	if err != nil {
		tx.Rollback()
		return err
	}
	err = row.Scan(&profileID)
	if err != nil {
		tx.Rollback()
		return err
	}
	for _, profileAddress := range profile.Addresses {
		_, err = tx.Exec(`
INSERT INTO addresses (profile_id, address, point)
VALUES ($1, $2, ST_SetSRID(ST_Point($3, $4),4326))`,
			profileID,
			profileAddress.Address,
			profileAddress.Longitude,
			profileAddress.Latitude)
		if err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}

// WriteAlert writes a SentAlert struct into the database
func (pg *Postgres) WriteAlert(s SentAlert) error {
	json, err := s.Geo.Geometry.MarshalJSON()
	if err != nil {
		return err
	}
	_, err = pg.Exec(`
INSERT INTO sent_alerts
(message,
sent_sms,
sent_email,
sent_people,
geo,
sender,
severity
)
VALUES ($1, $2, $3, $4, ST_SetSRID(ST_GeomFromGeoJSON($5),4326), $6, $7)
`, s.Message, s.SentSMS, s.SentEmail, s.SentPeople, json, s.Sender, s.Severity)
	return err
}

// Close implements io.Closer
func (pg *Postgres) Close() error {
	return pg.DB.Close()
}

// Postgres wraps our DB initialization
type Postgres struct{ *sql.DB }

// Datastore defines our interface
type Datastore interface {
	LoginUser(User) bool
	CreateUser(User) error
	DeleteUser(User) error
	FindRecipients(*geojson.Geometry) ([]AlertRecipient, error)
	FetchAlertHistory() ([]SentAlert, error)
	FetchProfile(string) (Profile, error)
	WriteProfile(string, Profile) error
	WriteAlert(SentAlert) error
	io.Closer
}

// NewDB creates a new Postgres db connection
func NewDB() (*Postgres, error) {
	// Open postgres driver
	database, err := sql.Open("postgres", "postgres://pqvp:pqvp@localhost/pqvp?sslmode=disable")
	if err != nil {
		return nil, err
	}

	// Ping to check if the connection is ok
	if err = database.Ping(); err != nil {
		return nil, err
	}
	return &Postgres{database}, nil
}
