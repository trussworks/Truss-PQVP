package main

import (
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
