package main

import (
	"context"
	"fmt"
	"net/http"

	"go.uber.org/zap"
)

func authMiddleware(i http.Handler) http.Handler {
	mw := func(w http.ResponseWriter, r *http.Request) {
		email, err := Allowed(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprintf(w, "user is not allowed")
			logger.Error("user is not allowed",
				zap.Error(err),
			)
			return
		}
		ctx := context.WithValue(r.Context(), userKey, User{
			Email: email,
		})
		r = r.WithContext(ctx)
	}
	return http.HandlerFunc(mw)
}
