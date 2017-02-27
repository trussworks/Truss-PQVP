package main

import (
	"context"
	"fmt"
	"net/http"
)

func authMiddleware(i http.Handler) http.Handler {
	mw := func(w http.ResponseWriter, r *http.Request) {
		claims, err := Allowed(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprintf(w, "user is not allowed")
			return
		}

		ctx := context.WithValue(r.Context(), userKey, User{
			Email: claims["Email"].(string),
		})
		r = r.WithContext(ctx)
	}
	return http.HandlerFunc(mw)
}
