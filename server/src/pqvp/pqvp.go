package main

import (
	"flag"
	"net/http"
	"os"

	"go.uber.org/zap"
	"goji.io"
	"goji.io/pat"
)

var (
	db     Datastore
	logger *zap.Logger
)

// key is an unexported type for keys defined in this package.
type key int

// userKey is the key for user.User values in Contexts. It is unexported.
var userKey key = 1

func main() {
	entry := flag.String("entry", "../client/dist/index.html", "the entrypoint to serve.")
	static := flag.String("static", "../client/dist", "the directory to serve static files from.")
	docs := flag.String("docs", "../client/dist/docs", "the directory to serve swagger documentation from.")
	port := flag.String("port", ":80", "the `port` to listen on.")
	flag.Parse()

	logger, _ = zap.NewProduction()

	var err error
	db, err = NewDB()
	if err != nil {
		logger.Fatal("could not open db connection",
			zap.Error(err),
		)
	}
	defer db.Close()

	root := goji.NewMux()

	// Base routes
	root.HandleFunc(pat.Get("/"), IndexHandler(entry))
	root.Handle(pat.Get("/:file.:ext"), http.FileServer(http.Dir(*static)))
	root.HandleFunc(pat.Get("/profile"), IndexHandler(entry))
	root.HandleFunc(pat.Get("/admin"), IndexHandler(entry))
	root.HandleFunc(pat.Get("/admin/notifications"), IndexHandler(entry))

	// Login and Signup are unauthed
	root.HandleFunc(pat.Post("/api/login"), Login)
	root.HandleFunc(pat.Post("/api/signup"), Signup)

	// Admin routes with auth
	admin := goji.SubMux()
	admin.Use(authMiddleware)
	root.Handle(pat.New("/api/admin/*"), admin)
	admin.HandleFunc(pat.Get("/"), whoami)

	// Non-admin routes with auth
	auth := goji.SubMux()
	auth.Use(authMiddleware)
	root.Handle(pat.New("/api/profile/*"), auth)
	auth.HandleFunc(pat.Get("/"), GetProfile)
	auth.HandleFunc(pat.Post("/"), UpdateProfile)
	root.Handle(pat.Post("/api/alert/*"), auth)
	auth.HandleFunc(pat.Post("/"), SendAlert)

	// Documentation routes
	root.Handle(pat.Get("/docs"), http.RedirectHandler("/docs/", 301))
	root.Handle(pat.Get("/docs/*"), http.StripPrefix("/docs/", http.FileServer(http.Dir(*docs))))

	// Start the server
	http.ListenAndServe(*port, root)
}
