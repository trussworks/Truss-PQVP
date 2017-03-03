package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAuthMiddleware(t *testing.T) {
	user := User{"pharoah@truss.works", "elevation"}
	jwtToken, err := CreateJwt(user)
	if err != nil {
		t.Errorf("Could not create the jwt")
	}

	u, _ := json.Marshal(user)
	req, err := http.NewRequest("GET", "/", bytes.NewBuffer(u))
	req.Header.Set("Authorization", jwtToken)

	rr := httptest.NewRecorder()
	handler := authMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if r.Context().Value(userKey).(User).Email != "pharoah@truss.works" {
			t.Errorf("could not get user from request context")
		}
	}))
	handler.ServeHTTP(rr, req)
}
