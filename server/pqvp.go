package main

import (
	"database/sql"
	"flag"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"log"
	"net"
	"net/http"
	"sync"
)

var (
	once     sync.Once
	database *sql.DB
	mutex    = &sync.Mutex{}
)

func main() {

	entry := flag.String("entry", "../client/dist/index.html", "the entrypoint to serve.")
	static := flag.String("static", "../client/dist", "the directory to serve static files from.")
	port := flag.String("port", ":80", "the `port` to listen on.")
	flag.Parse()

	listener, err := net.Listen("tcp", *port)
	if err != nil {
		log.Fatal("Could not bind to port")
	}

	goji.Get("/hello/:name", hello)
	goji.Get("/", IndexHandler(entry))
	goji.Handle("/:file.:ext", http.FileServer(http.Dir(*static)))
	goji.ServeListener(listener)
}

// Hello takes a request along with params and responds with hello :name
func hello(c web.C, w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello, %s!\n", c.URLParams["name"])
}

// IndexHandler serves up our index.html
func IndexHandler(entrypoint *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *entrypoint)
	}
}

func GetDB() *sql.DB {
	once.Do(func() {
		// Get connection parameters
		dns := fmt.Sprintf("user=pqvp password=pqvp dbname=pqvp sslmode=disable")
		// Open postgres driver
		var err error = nil
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
