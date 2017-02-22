package main

import (
	"github.com/stretchr/testify/assert"
	"github.com/zenazn/goji/web"
	"net/http/httptest"
	"testing"
)

// Boilerplate check to test goji/web is setup correctly
func TestHello(t *testing.T) {
	responseRecorder := httptest.NewRecorder()

	hello(web.C{URLParams: map[string]string{"name": "pqvp"}}, responseRecorder, nil)

	expected := []byte("hello, pqvp!\n")
	// make sure we get a 200 response and the body matches the string
	assert.Equal(t, responseRecorder.Body.Bytes(), expected)
	assert.Equal(t, responseRecorder.Code, 200)
}
