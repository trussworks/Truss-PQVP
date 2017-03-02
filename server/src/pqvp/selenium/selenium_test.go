package main

import (
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"sourcegraph.com/sourcegraph/go-selenium"
)

var browsers = []string{"iphone", "android", "chrome", "firefox", "safari"}
var remoteEndpoint = fmt.Sprintf("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", os.Getenv("SAUCE_USERNAME"), os.Getenv("SAUCE_ACCESS_KEY"))

func LoadTitle(cap map[string]interface{}, t *testing.T) {
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

	title, _ := wd.Title()
	assert.Equal(t, "PQVP App", title)
}

func TestLoadTitle(t *testing.T) {
	if os.Getenv("SAUCE_USERNAME") == "" {
		t.Skip("skipping test; $SAUCE_USERNAME not set")
	}
	for _, v := range browsers {
		LoadTitle(map[string]interface{}{"browserName": v}, t)
	}

}
