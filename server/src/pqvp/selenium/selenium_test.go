package main

import (
	"fmt"
	"math/rand"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"sourcegraph.com/sourcegraph/go-selenium"
)

var caps = []map[string]interface{}{
	{"platformVersion": "10.2", "deviceName": "iPhone Simulator", "platformName": "iOS", "browserName": "Safari"},
	{"platformVersion": "5.1", "deviceName": "Android Emulator", "platformName": "Android", "browserName": "Browser"},
	{"browserName": "chrome", "version": "56.0"},
	{"browserName": "firefox", "version": "51.0"},
	{"browserName": "safari", "version": "10.0"},
}
var remoteEndpoint = fmt.Sprintf("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", os.Getenv("SAUCE_USERNAME"), os.Getenv("SAUCE_ACCESS_KEY"))

func generateUser(cap map[string]interface{}, t *testing.T) {
	var caps = selenium.Capabilities(cap)
	wd, err := selenium.NewRemote(caps, remoteEndpoint)
	if err != nil {
		t.Fatal(err)
	}
	defer wd.Quit()

	err = wd.Get("http://localhost/")
	if err != nil {
		t.Fatal(err)
	}

	// make sure we can load the page
	title, _ := wd.Title()
	assert.Equal(t, "PQVP App", title, cap["browserName"])

	email := fmt.Sprintf("test%d@truss.works", rand.Int())

	// go through signup
	emailElem, err := wd.FindElement(selenium.ByName, "email")
	if err != nil {
		t.Fatal(err)
	}
	emailElem.Clear()
	emailElem.SendKeys(email)

	passwordElem, err := wd.FindElement(selenium.ByName, "password")
	if err != nil {
		t.Fatal(err)
	}
	passwordElem.Clear()
	passwordElem.SendKeys("shhhhhh")
	passwordElem.Submit()

	time.Sleep(1 * time.Second)
	// verify we made it to the profile page
	url, err := wd.CurrentURL()
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, "http://localhost/profile", url, cap["browserName"])

}

func TestSignUp(t *testing.T) {
	if os.Getenv("SAUCE_USERNAME") == "" {
		t.Skip("skipping test; $SAUCE_USERNAME not set")
	}
	for _, cap := range caps {
		generateUser(cap, t)
	}

}
