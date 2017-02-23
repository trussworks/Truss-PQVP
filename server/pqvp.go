package main

import (
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"sync"

	"github.com/asaskevich/govalidator"
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
	Email    string `json:"email" valid:"required,email"`
	Password string `json:"password" valid:"required"`
}

func main() {

	entry := flag.String("entry", "../client/dist/index.html", "the entrypoint to serve.")
	static := flag.String("static", "../client/dist", "the directory to serve static files from.")
	port := flag.String("port", ":80", "the `port` to listen on.")
	flag.Parse()

	mux := goji.NewMux()

	mux.HandleFunc(pat.Get("/hello/:name"), hello)
	mux.HandleFunc(pat.Post("/api/login"), Login)
	mux.HandleFunc(pat.Post("/api/signup"), Signup)
	mux.HandleFunc(pat.Get("/"), IndexHandler(entry))
	mux.Handle(pat.Get("/:file.:ext"), http.FileServer(http.Dir(*static)))

	http.ListenAndServe(*port, mux)
}

// Hello takes a request along with params and responds with hello :name
func hello(w http.ResponseWriter, r *http.Request) {
	name := pat.Param(r, "name")
	fmt.Fprintf(w, "hello, %s!\n", name)
}

/*
Login logs in a user, returns the session token.
Test with this curl command:
curl -H "Content-Type: application/json" -d '{"email":"Joe@gmail.com", "pass":"1234"}' http://localhost:8080/login
*/
func Login(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	// handle incorrect JSON
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}
	valid, err := govalidator.ValidateStruct(user)
	// make sure the input matches the User struct
	if !valid {
		http.Error(w, http.StatusText(400), 400)
		return
	}
	success := LoginUser(user)
	if !success {
		http.Error(w, http.StatusText(404), 404)
	}
	//TODO add session token in the response
}

/*
Signup creates a new user.
Test with this curl command:
curl -H "Content-Type: application/json" -d '{"email":"Joe@gmail.com", "pass":"1234"}' http://localhost:8080/signup
*/
func Signup(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	// handle incorrect JSON
	if err != nil {
		http.Error(w, http.StatusText(400), 400)
		return
	}
	valid, err := govalidator.ValidateStruct(user)
	// make sure the input matches the User struct
	if !valid {
		fmt.Println(err)
		http.Error(w, http.StatusText(400), 400)
		return
	}
	err = CreateUser(user)
	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}
}

// IndexHandler serves up our index.html
func IndexHandler(entrypoint *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *entrypoint)
	}
}
