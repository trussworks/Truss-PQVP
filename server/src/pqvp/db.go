package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// LoginUser checks bcrypt hashed passwords match in the users table
func LoginUser(u User) bool {
	db := GetDB()
	row := db.QueryRow("SELECT password_hash FROM users WHERE email = $1", u.Email)
	var pass string
	err := row.Scan(&pass)
	if err != nil {
		log.Println(err)
		return false

	}
	err = bcrypt.CompareHashAndPassword([]byte(pass), []byte(u.Password))
	if err != nil {
		log.Printf("login failed %s: %s", u.Email, err)
		return false
	}
	return true
}

// CreateUser Creates a new user in the users table
func CreateUser(u User) error {
	db := GetDB()
	hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	stmt, err := db.Prepare("INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING id")
	if err != nil {
		log.Println(err)
		return err
	}
	var id int64
	err = stmt.QueryRow(u.Email, hash).Scan(&id)
	if err != nil {
		log.Println(err)
		return err
	}
	log.Printf("created user %s with id %d", u.Email, id)
	return err
}

func LoadProfile(email string) (Profile, error) {
	db := GetDB()
	row := db.QueryRow(`
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
	rows, err := db.Query(`
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

// GetDB sets up our database connection
func GetDB() *sql.DB {
	once.Do(func() {
		// Get connection parameters
		dns := fmt.Sprintf("user=pqvp password=pqvp dbname=pqvp sslmode=disable")
		// Open postgres driver
		var err error
		database, err = sql.Open("postgres", dns)
		if err != nil {
			log.Fatal("Opening database", err)
		}

		/* Open does not actually try to connect to the database so we Ping() here as a way of checking the configuration
		   during the call to OpenDB.
		*/
		if err = database.Ping(); err != nil {
			database.Close()
			log.Fatal("Pinging database", err)
		}
	})
	return database
}
