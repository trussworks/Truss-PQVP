package main

import (
	"os"
	"testing"

	"go.uber.org/zap"
)

func TestMain(m *testing.M) {
	var err error
	logger, err = zap.NewProduction()
	db, err = NewDB()
	if err != nil {
		logger.Fatal("could not open db connection",
			zap.Error(err),
		)
	}
	// Setup a test user
	db.CreateUser(User{Email: "joe@gmail.com", Password: "peanutbutter"})

	// start and shutdown our tests
	ret := m.Run()
	db.DeleteUser(User{Email: "joe@gmail.com", Password: "peanutbutter"})
	db.DeleteUser(User{Email: "mario@gmail.com", Password: "peanutbutter"})
	db.Close()
	os.Exit(ret)
}
