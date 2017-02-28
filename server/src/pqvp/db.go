package main

import (
	"database/sql"
	"fmt"

	"go.uber.org/zap"

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
		logger.Error("could not select user",
			zap.Error(err),
		)
		return false

	}
	err = bcrypt.CompareHashAndPassword([]byte(pass), []byte(u.Password))
	if err != nil {
		logger.Error("could not login user",
			zap.String("user", u.Email),
			zap.Error(err),
		)
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
		logger.Error("could not insert user",
			zap.Error(err),
		)
		return err
	}

	var id int64
	err = stmt.QueryRow(u.Email, hash).Scan(&id)
	if err != nil {
		logger.Error("could not insert user",
			zap.Error(err),
		)
		return err
	}
	logger.Info("user created successfully",
		zap.String("email", u.Email),
		zap.Int64("id", id),
	)
	return err
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
			logger.Fatal("could not open database",
				zap.Error(err),
			)
		}

		/* Open does not actually try to connect to the database so we Ping() here as a way of checking the configuration
		   during the call to OpenDB.
		*/
		if err = database.Ping(); err != nil {
			database.Close()
			logger.Fatal("could not ping database",
				zap.Error(err),
			)
		}
	})
	return database
}
