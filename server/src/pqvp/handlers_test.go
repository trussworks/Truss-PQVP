package main

import (
	"bytes"
	"context"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

var (
	invalidJSON = []byte(`"email":"joe@gmail.com", "fail":"peanutbutter"`)
	userGood    = []byte(`{"email":"mario@gmail.com", "password":"peanutbutter"}`)
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

func authRequest(r *http.Request, email string) *http.Request {
	ctx := context.WithValue(r.Context(), userKey, User{
		Email: email,
	})
	r = r.WithContext(ctx)
	return r
}

// Verifies a user can signup
func TestGoodSignup(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/signup", userGood)
	Signup(res, req)
	// make sure we get a 201 response and the body matches the string
	assert.Equal(t, 201, res.Code)
	//TODO check for session token
}

func TestBadSignup(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/signup", userBad)
	Signup(res, req)
	/// make sure we bail on bad input
	assert.Equal(t, 400, res.Code)
}

func TestBadSignupJson(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/signup", invalidJSON)
	Signup(res, req)
	/// make sure we bail on bad json
	assert.Equal(t, 400, res.Code)
}

// Verifies login endpoint is working
func TestLogin(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/login", userGood)
	Login(res, req)
	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, 200, res.Code)
}

func TestBadLogin(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/login", userBad)
	Login(res, req)
	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, 400, res.Code)
}

func TestBadLoginPass(t *testing.T) {
	var badPass = []byte(`{"email":"asd@gomasd.com", "password":"asdsss"}`)
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/login", badPass)
	Login(res, req)

	// 404 if login is not found
	assert.Equal(t, res.Code, 404)
}

func TestUpdateProfile(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/profile", profileGood)
	req = authRequest(req, "joe@gmail.com")
	UpdateProfile(res, req)
	assert.Equal(t, 200, res.Code)
}

func TestBadUpdateProfile(t *testing.T) {
	res := httptest.NewRecorder()
	req := generatePost(t, "/api/profile", profileBad)
	UpdateProfile(res, req)
	assert.Equal(t, 400, res.Code)
}

func TestFindRecipients(t *testing.T) {
	json, err := ioutil.ReadFile("test/sample-feature.json")
	if err != nil {
		t.Fatal(err)
	}

	res := httptest.NewRecorder()
	req := generatePost(t, "/api/alert", json)
	req = authRequest(req, "joe@gmail.com")
	SendAlert(res, req)
	assert.Equal(t, 200, res.Code)

	//TODO insert geopoints and profiles once the plumbing is hooked up

}

func TestGetAlertHistory(t *testing.T) {
	res := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/api/alert/history", nil)
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		t.Fatal(err)
	}
	req = authRequest(req, "joe@gmail.com")
	GetAlertHistory(res, req)
	assert.Equal(t, 200, res.Code)
}
