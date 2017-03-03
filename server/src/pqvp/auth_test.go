package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"testing"

	jwt "github.com/dgrijalva/jwt-go"
)

func TestCreateJwt(t *testing.T) {
	user := User{"coltrane@truss.works", "lovesupreme"}

	jwtToken, err := CreateJwt(user)
	if err != nil {
		t.Errorf("Did not receive a JWT back.")
	}

	token, err := jwt.ParseWithClaims(jwtToken, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})
	if err != nil {
		t.Errorf("Could not parse token.")
	}

	if err == nil && token.Valid {
		return
	}

	t.Errorf("Token was invalid.")
}

func TestBadCreateJwt(t *testing.T) {
	_, err := CreateJwt(User{})
	if err != nil {
		t.Errorf("Should not have received JWT back.")
	}
}

func TestAllowed(t *testing.T) {
	user := User{"miles@truss.works", "blueingreen"}
	jwtToken, err := CreateJwt(user)
	if err != nil {
		t.Errorf("Could not create JWT")
	}
	u, _ := json.Marshal(user)

	req, err := http.NewRequest("GET", "/", bytes.NewBuffer(u))
	if err != nil {
		t.Errorf("Could not creqte the request")
	}
	req.Header.Set("Authorization", jwtToken)

	claims, err := Allowed(req)
	if err != nil {
		t.Errorf("Could not auth the token")
	}

	if claims.Email != user.Email {
		t.Errorf("JWT claims not properly set")
	}
}
