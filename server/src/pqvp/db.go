package main

import (
	"database/sql"
	"github.com/lib/pq"
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
func (pg *Postgres) FindRecipients(geo *geojson.Geometry) ([]string, error) {
	var phoneNumbers []string

	json, err := geo.MarshalJSON()
	if err != nil {
		return nil, err
	}

	// Look for the phone numbers that having addresses in the alert geometry
	// Right now we assume the GeoJSON geometry is a polygon
	query := `
	   SELECT DISTINCT p.phone
	   FROM Addresses a, Profiles p
	   WHERE ST_Intersects(a.point, ST_SetSRID(ST_GeomFromGeoJSON($1),4326))
	   AND a.profile_id = p.id`

	rows, err := pg.Query(query, json)
	if err != nil {
		return phoneNumbers, err
	}
	defer rows.Close()

	for rows.Next() {
		var phoneNumber string
		err = rows.Scan(&phoneNumber)
		phoneNumbers = append(phoneNumbers, phoneNumber)
	}
	if err != nil {
		return nil, err

	}

	return phoneNumbers, nil
}

func (pg *Postgres) FetchProfile(email string) (Profile, error) {
	row := pg.QueryRow(`
SELECT profiles.id, profiles.phone
FROM profiles, users
WHERE profiles.user_id = users.id AND users.email = $1`, email)
	var phone string
	var profile_id int32
	err := row.Scan(&profile_id, &phone)
	if err != nil {
		return Profile{}, err
	}
	addresses := make([]ProfileAddress, 0)
	profile := Profile{phone, addresses}
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
	if err != nil {
		return Profile{}, err
	}
	return profile, nil
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
	FindRecipients(*geojson.Geometry) ([]string, error)
	FetchProfile(string) (Profile, error)
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
