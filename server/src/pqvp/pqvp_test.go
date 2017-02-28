package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

var (
	invalidJSON = []byte(`"email":"joe@gmail.com", "fail":"peanutbutter"`)
	userGood    = []byte(`{"email":"joe@gmail.com", "password":"peanutbutter"}`)
	userBad     = []byte(`{"email":"joe@gmail.com", "address":"peanutbutter"}`)
	profileGood = []byte(`{"phone":"1234567890", "addresses":[{"address": "1 My Address", "latitude":37.770070, "longitude":-122.428790}]}`)
	profileBad  = []byte(`{"phone":"1231231231", "addresses":[{"address": "address string"}]}`)
)

func generatePost(t *testing.T, endpoint string, json []byte) *http.Request {
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		t.Fatal(err)
	}
	return req
}

// Verifies a user can signup
func TestSignup(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/signup", userGood)
	Signup(res, req)
	// make sure we get a 201 response and the body matches the string
	assert.Equal(t, 201, res.Code)
	//TODO check for session token

	res = httptest.NewRecorder()
	req = generatePost(t, "/api/signup", userBad)
	Signup(res, req)
	/// make sure we bail on bad input
	assert.Equal(t, 400, res.Code)

	res = httptest.NewRecorder()
	req = generatePost(t, "/api/signup", invalidJSON)
	Signup(res, req)
	/// make sure we bail on bad json
	assert.Equal(t, 400, res.Code)
}

// Verifies login endpoint is working
func TestLogin(t *testing.T) {
	CreateUser(User{Email: "joe@gmail.com", Password: "peanutbutter"})

	res := httptest.NewRecorder()
	req := generatePost(t, "/api/login", userGood)
	Login(res, req)
	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, 200, res.Code)

	res = httptest.NewRecorder()
	req = generatePost(t, "/api/login", userBad)
	Login(res, req)
	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, 400, res.Code)

	var badPass = []byte(`{"email":"asd@gomasd.com", "password":"asdsss"}`)
	res = httptest.NewRecorder()
	req = generatePost(t, "/api/login", badPass)
	Login(res, req)

	// 404 if login is not found
	assert.Equal(t, res.Code, 404)

}

func TestUpdateProfile(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/profile", profileGood)
	UpdateProfile(res, req)
	assert.Equal(t, 200, res.Code)

	res = httptest.NewRecorder()
	req = generatePost(t, "/api/profile", profileBad)
	UpdateProfile(res, req)
	assert.Equal(t, 400, res.Code)
}
