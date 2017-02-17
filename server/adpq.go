package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
)

func main() {

	entry := flag.String("entry", "../client/public/index.html", "the entrypoint to serve.")
	static := flag.String("static", "../client/dist", "the directory to serve static files from.")
	port := flag.String("port", ":80", "the `port` to listen on.")
	flag.Parse()

	listener, err := net.Listen("tcp", *port)
	if err != nil {
		log.Fatal("Could not bind to port")
	}

	goji.Get("/hello/:name", hello)
	goji.Get("/", IndexHandler(entry))
	goji.Get("/dist", AssetsHandler(static))
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

// AssetsHandler serves up our static assets
func AssetsHandler(static *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *static)
	}
}
