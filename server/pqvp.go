package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"sync"

	_ "github.com/lib/pq"
	"goji.io"
	"goji.io/pat"
)

var (
	once     sync.Once
	database *sql.DB
	mutex    = &sync.Mutex{}
)

// User contains an email and a password
type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func main() {

	entry := flag.String("entry", "../client/dist/index.html", "the entrypoint to serve.")
	static := flag.String("static", "../client/dist", "the directory to serve static files from.")
	port := flag.String("port", ":80", "the `port` to listen on.")
	flag.Parse()

	mux := goji.NewMux()

	mux.HandleFunc(pat.Get("/hello/:name"), hello)
	mux.HandleFunc(pat.Get("/"), IndexHandler(entry))
	mux.Handle(pat.Get("/:file.:ext"), http.FileServer(http.Dir(*static)))

	http.ListenAndServe(*port, mux)
}

// Hello takes a request along with params and responds with hello :name
func hello(w http.ResponseWriter, r *http.Request) {
	name := pat.Param(r, "name")
	fmt.Fprintf(w, "hello, %s!\n", name)
}

// IndexHandler serves up our index.html
func IndexHandler(entrypoint *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *entrypoint)
	}
}

// GetDB sets up our database connection
func GetDB() *sql.DB {
	once.Do(func() {
		// Get connection parameters
		dns := fmt.Sprintf("user=pqvp password=pqvp dbname=pqvp sslmode=disable")
		// Open postgres driver
		var err error
		database, err = sql.Open("postgres", dns)
		if err != nil {
			log.Fatal("Opening database", err)
		}

		/* Open does not actually try to connect to the database so we Ping() here as a way of checking the configuration
		   during the call to OpenDB.
		*/
		if err = database.Ping(); err != nil {
			database.Close()
			log.Fatal("Pinging database", err)
		}
	})
	return database
}
