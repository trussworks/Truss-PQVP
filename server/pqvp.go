package main

import (
	"flag"
	"fmt"
	"net/http"

	"goji.io"
	"goji.io/pat"
)

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
	fmt.Fprintf(w, "hello, %s!\n", pat.Param(r, "name"))
}

// IndexHandler serves up our index.html
func IndexHandler(entrypoint *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *entrypoint)
	}
}
