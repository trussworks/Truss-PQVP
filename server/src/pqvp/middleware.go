package main

import (
	"context"
	"fmt"
	"net/http"

	"go.uber.org/zap"
)

func authMiddleware(i http.Handler) http.Handler {
	mw := func(w http.ResponseWriter, r *http.Request) {
		claims, err := Allowed(r)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprintf(w, "user is not allowed")
			logger.Error("user is not allowed",
				zap.Error(err),
			)
			return
		}
		ctx := context.WithValue(r.Context(), userKey, User{
			Email: claims.Email,
		})
		r = r.WithContext(ctx)
		i.ServeHTTP(w, r)
	}
	return http.HandlerFunc(mw)
}
