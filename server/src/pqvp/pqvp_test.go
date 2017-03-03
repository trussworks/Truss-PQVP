package main

import (
	"os"
	"testing"

	"go.uber.org/zap"
)

var (
	invalidJSON = []byte(`"email":"joe@gmail.com", "fail":"peanutbutter"`)
	userGood    = []byte(`{"email":"mario@gmail.com", "password":"peanutbutter"}`)
	userBad     = []byte(`{"email":"joe@gmail.com", "address":"peanutbutter"}`)
	profileGood = []byte(`{"phone":"1234567890", "addresses":[{"address": "1 My Address", "latitude":37.770070, "longitude":-122.428790}]}`)
	profileBad  = []byte(`{"phone":"1231231231", "addresses":[{"address": "address string"}]}`)
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
