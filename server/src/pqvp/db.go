package main

import (
	"database/sql"
	"io"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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

func (pg *Postgres) DeleteUser(u User) error {
	_, err := pg.Exec("DELETE FROM users WHERE email = $1", u.Email)
	if err != nil {
		return err
	}
	return nil
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
