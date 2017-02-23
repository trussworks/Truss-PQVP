package main

import (
	"errors"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	request "github.com/dgrijalva/jwt-go/request"
	"go.uber.org/zap"
)

type customClaims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

// A signing key should typically be a private key that is stored
// in a secure secrets management system. This would change in a
// non-prototype, production system.
var signingKey = []byte("truss-pqvp-demo")

// CreateJwt takes a User and returns a jwt token that has custom claims set.
func CreateJwt(u User) string {
	claims := customClaims{
		u.Email,
		jwt.StandardClaims{
			ExpiresAt: 15000,
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(signingKey)
	if err != nil {
		logger, _ := zap.NewProduction()
		logger.Fatal("could not sign the token with our key",
			zap.Error(err),
		)
	}
	return ss
}

// Allowed takes a request and verifies if the user is allowed to access
// the requested resource
func Allowed(r *http.Request) (jwt.MapClaims, error) {
	token, err := request.ParseFromRequestWithClaims(r, request.AuthorizationHeaderExtractor, customClaims{}, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})
	if err == nil && token.Valid {
		return token.Claims.(jwt.MapClaims), nil
	}

	return nil, errors.New("user is not allowed")
}
