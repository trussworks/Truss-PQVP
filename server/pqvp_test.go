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
	assert.Equal(t, res.Code, 200)
}

// Verifies a user can signup
func TestSignup(t *testing.T) {
	res := httptest.NewRecorder()
	var json = []byte(`{"email":"joe@gmail.com", "password":"peanutbutter"}`)
	req, err := http.NewRequest("POST", "/signup", bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		t.Fatal(err)
	}

	Signup(res, req)

	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, res.Code, 200)
	//TODO check for session token

	var badJSON = []byte(`"email":"joe@gmail.com", "fail":"peanutbutter"`)
	req, err = http.NewRequest("POST", "/signup", bytes.NewBuffer(badJSON))
	req.Header.Set("Content-Type", "application/json")
	Signup(res, req)

	/// make sure we bail on bad json
	assert.Equal(t, res.Code, 500)
}

// Verifies login endpoint is working
func TestLogin(t *testing.T) {
	CreateUser(User{Email: "asd@gomasd.com", Password: "asd"})

	res := httptest.NewRecorder()
	var json = []byte(`{"email":"asd@gomasd.com", "password":"asd"}`)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(json))
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		t.Fatal(err)
	}

	Login(res, req)

	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, res.Code, 200)

	var badPass = []byte(`{"email":"asd@gomasd.com", "password":"asdsss"}`)
	req, err = http.NewRequest("POST", "/login", bytes.NewBuffer(badPass))
	req.Header.Set("Content-Type", "application/json")
	if err != nil {
		t.Fatal(err)
	}

	Login(res, req)

	// 404 if login is not found
	assert.Equal(t, res.Code, 404)

}
