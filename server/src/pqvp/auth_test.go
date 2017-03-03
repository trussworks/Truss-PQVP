package main

import (
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
