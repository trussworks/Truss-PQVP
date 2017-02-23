package main

import (
	jwt "github.com/dgrijalva/jwt-go"
	"go.uber.org/zap"
)

type customClaims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

// CreateJwt takes a User and returns a jwt token that has custom claims set.
func CreateJwt(u User) string {
	// A signing key should typically be a private key that is stored
	// in a secure secrets management system. This would change in a
	// non-prototype, production system
	signingKey := []byte("truss-pqvp-demo")

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
