package main

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"

	"goji.io/pattern"
)

var (
	invalidJSON = []byte(`"email":"joe@gmail.com", "fail":"peanutbutter"`)
	userGood    = []byte(`{"email":"joe@gmail.com", "password":"peanutbutter"}`)
	userBad     = []byte(`{"email":"joe@gmail.com", "address":"peanutbutter"}`)
)

func generatePost(t *testing.T, endpoint string, json []byte) *http.Request {
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		t.Fatal(err)
	}
	return req
}

// Boilerplate check to test goji/web is setup correctly
func TestHello(t *testing.T) {
	res := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/hello/pqvp", nil)
	if err != nil {
		t.Fatal(err)
	}

	ctx := context.WithValue(req.Context(), pattern.Variable("name"), "pqvp")
	req = req.WithContext(ctx)

	hello(res, req)

	expected := []byte("hello, pqvp!\n")
	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, res.Body.Bytes(), expected)
	assert.Equal(t, 200, res.Code)
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