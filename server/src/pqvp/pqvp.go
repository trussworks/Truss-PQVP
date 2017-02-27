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

	root := goji.NewMux()

	admin := goji.SubMux()
	admin.Use(authMiddleware)

	// Base routes
	root.HandleFunc(pat.Get("/"), IndexHandler(entry))
	root.Handle(pat.Get("/:file.:ext"), http.FileServer(http.Dir(*static)))
	root.HandleFunc(pat.Get("/hello/:name"), hello)

	// API routes
	root.HandleFunc(pat.Post("/api/login"), Login)
	root.HandleFunc(pat.Post("/api/signup"), Signup)
	root.HandleFunc(pat.Get("/api/profile"), GetProfile)
	root.HandleFunc(pat.Post("/api/profile"), UpdateProfile)

	// Documentation routes
	root.Handle(pat.Get("/docs"), http.RedirectHandler("/docs/", 301))
	root.Handle(pat.Get("/docs/*"), http.StripPrefix("/docs/", http.FileServer(http.Dir(*docs))))

	// Admin routes
	root.Handle(pat.Get("/admin"), admin)
	root.Handle(pat.Get("/admin/*"), admin)
	admin.Handle(pat.Get("/admin"), IndexHandler(entry))
	admin.Handle(pat.Get("/admin/*"), IndexHandler(entry))

	// Profile routes
	root.Handle(pat.Get("/profile"), admin)
	root.Handle(pat.Get("/profile/*"), admin)
	admin.Handle(pat.Get("/profile"), IndexHandler(entry))
	admin.Handle(pat.Get("/profile/*"), IndexHandler(entry))

	// Start the server
	http.ListenAndServe(*port, root)
}

// Hello takes a request along with params and responds with hello :name
func hello(w http.ResponseWriter, r *http.Request) {
	name := pat.Param(r, "name")
	fmt.Fprintf(w, "hello, %s!\n", name)
}

type resAuthUser struct {
	Email       string `json:"email"`
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
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
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	valid, err := govalidator.ValidateStruct(user)
	// make sure the input matches the User struct
	if !valid {
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	success := LoginUser(user)
	if !success {
		w.WriteHeader(http.StatusNotFound)
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}

	token, err := CreateJwt(user)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}
	ru, _ := json.Marshal(resAuthUser{user.Email, token, 15000})
	fmt.Fprintf(w, "%s", ru)
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
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	valid, err := govalidator.ValidateStruct(user)
	// make sure the input matches the User struct
	if !valid {
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	err = CreateUser(user)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	token, err := CreateJwt(user)
	if err != nil {
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusCreated)
	ru, _ := json.Marshal(resAuthUser{user.Email, token, 15000})
	fmt.Fprintf(w, "%s", ru)
}

type ProfileAddress struct {
	Address   string `json:"address"`
	Latitude  float64
	Longitude float64
}

type Profile struct {
	Phone     string           `json:"phone"`
	Addresses []ProfileAddress `json:"addresses"`
}

func dummyProfile() Profile {
	addresses := make([]ProfileAddress, 0)
	profile := Profile{"1234567890", addresses}
	addy := ProfileAddress{"9 Germania St., San Francisco, CA 94117",
		37.770970,
		-122.428730}
	profile.Addresses = append(profile.Addresses, addy)
	return profile
}

/*
GetProfile gets a users profile.
curl -H "Content-Type: application/json" http://localhost:80/api/profile
*/
func GetProfile(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	// Read profile from DB here.
	profile := dummyProfile()
	rp, _ := json.Marshal(profile)
	fmt.Fprintf(w, "%s", rp)
}

/*
UpdateProfile updates a users profile.
curl -H "Content-Type: application/json" -d '{"phone":"4434567890","addresses":[{"address":"9 Germania St., San Francisco, CA 94117","Latitude":37.77097,"Longitude":-122.42873}]}' http://localhost:80/api/profile
*/
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var profile Profile
	err := json.NewDecoder(r.Body).Decode(&profile)
	if err != nil {
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	valid, err := govalidator.ValidateStruct(profile)
	if !valid {
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	// Write profile into DB here.
	rp, _ := json.Marshal(profile)
	fmt.Fprintf(w, "%s", rp)
}

// IndexHandler serves up our index.html
func IndexHandler(entrypoint *string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, *entrypoint)
	}
}

// whoami is a dummy admin handler
func whoami(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "you are clearly admin")
}
