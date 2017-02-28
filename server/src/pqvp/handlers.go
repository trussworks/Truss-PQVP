package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/asaskevich/govalidator"
	"go.uber.org/zap"
)

// resAuthUser returns a user to the client with
// auth token added and the password stripped
type resAuthUser struct {
	Email       string `json:"email"`
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
}

// User contains an email and a password
type User struct {
	Email    string `json:"email" valid:"required,email"`
	Password string `json:"password" valid:"required"`
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
		logger.Error("could not decode json",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	valid, err := govalidator.ValidateStruct(user)
	// make sure the input matches the User struct
	if !valid {
		logger.Error("request not valid",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(http.StatusBadRequest), http.StatusBadRequest)
		return
	}
	success := db.LoginUser(user)
	if !success {
		logger.Error("could not log in user",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		w.WriteHeader(http.StatusNotFound)
		http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	}

	token, err := CreateJwt(user)
	if err != nil {
		logger.Error("could not create jwt",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
	}
	logger.Info("user login successful",
		zap.String("path", r.URL.Path),
		zap.String("user", user.Email),
	)
	ru, _ := json.Marshal(resAuthUser{user.Email, token, 900})
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
		logger.Error("could not decode json",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	valid, err := govalidator.ValidateStruct(user)
	// make sure the input matches the User struct
	if !valid {
		logger.Error("request not valid",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	err = db.CreateUser(user)
	if err != nil {
		logger.Error("could not create user",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	token, err := CreateJwt(user)
	if err != nil {
		logger.Error("could not create jwt",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	ru, _ := json.Marshal(resAuthUser{user.Email, token, 900})
	fmt.Fprintf(w, "%s", ru)

	logger.Info("user signup successful",
		zap.String("path", r.URL.Path),
		zap.String("user", user.Email),
	)
}

// ProfileAddress represents an address
type ProfileAddress struct {
	Address   string  `json:"address" valid:"required"`
	Latitude  float64 `json:"latitude" valid:"required"`
	Longitude float64 `json:"longitude" valid:"required"`
}

// Profile represents a profile
type Profile struct {
	Phone     string           `json:"phone" valid:"required"`
	Addresses []ProfileAddress `json:"addresses" valid:"required"`
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
	rp, err := json.Marshal(profile)
	if err != nil {
		logger.Error("could not marshal json",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(500), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "%s", rp)
	logger.Info("user profile returned",
		zap.String("path", r.URL.Path),
		zap.Error(err),
	)
}

/*
UpdateProfile updates a users profile.
curl -H "Content-Type: application/json" -d '{"phone":"4434567890","addresses":[{"address":"9 Germania St., San Francisco, CA 94117","Latitude":37.77097,"Longitude":-122.42873}]}' http://localhost:80/api/profile
*/
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var profile Profile
	err := json.NewDecoder(r.Body).Decode(&profile)
	if err != nil {
		logger.Error("could not decode json",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	valid, err := govalidator.ValidateStruct(profile)
	if !valid {
		logger.Error("could not validate struct",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	// Write profile into DB here.
	w.WriteHeader(http.StatusOK)
	rp, err := json.Marshal(profile)
	if err != nil {
		logger.Error("could not marshal json",
			zap.String("path", r.URL.Path),
			zap.Error(err),
		)
	}
	fmt.Fprintf(w, "%s", rp)
	logger.Info("profile updated succesfully",
		zap.String("path", r.URL.Path),
		zap.Error(err),
	)
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
