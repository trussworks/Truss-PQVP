package main

import (
	"database/sql"
	"flag"
	"net/http"
	"sync"

	"go.uber.org/zap"
	"goji.io"
	"goji.io/pat"
)

var (
	once   sync.Once
	db     *sql.DB
	mutex  = &sync.Mutex{}
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

	db = GetDB()
	defer db.Close()

	logger, _ = zap.NewProduction()

	root := goji.NewMux()

	// Base routes
	root.HandleFunc(pat.Get("/"), IndexHandler(entry))
	root.Handle(pat.Get("/:file.:ext"), http.FileServer(http.Dir(*static)))

	// API routes
	root.HandleFunc(pat.Post("/api/login"), Login)
	root.HandleFunc(pat.Post("/api/signup"), Signup)
	root.HandleFunc(pat.Get("/api/profile"), GetProfile)
	root.HandleFunc(pat.Post("/api/profile"), UpdateProfile)

	// Documentation routes
	root.Handle(pat.Get("/docs"), http.RedirectHandler("/docs/", 301))
	root.Handle(pat.Get("/docs/*"), http.StripPrefix("/docs/", http.FileServer(http.Dir(*docs))))

	// Admin routes
	admin := goji.SubMux()
	admin.Use(authMiddleware)
	root.Handle(pat.New("/api/admin/*"), admin)
	admin.HandleFunc(pat.Get("/"), whoami)

	// Profile routes
	root.Handle(pat.New("/profile/*"), admin)
	admin.Handle(pat.Get("/"), IndexHandler(entry))

	// Start the server
	http.ListenAndServe(*port, root)
}
