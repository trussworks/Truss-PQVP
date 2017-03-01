package main

import (
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"sourcegraph.com/sourcegraph/go-selenium"
)

var caps = selenium.Capabilities(map[string]interface{}{"browserName": "chrome", "platform": "macOS 10.12"})
var remoteEndpoint = fmt.Sprintf("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", os.Getenv("SAUCE_USERNAME"), os.Getenv("SAUCE_ACCESS_KEY"))

func TestLoadTitle(t *testing.T) {
	if os.Getenv("SAUCE_USERNAME") == "" {
		t.Skip("skipping test; $SAUCE_USERNAME not set")
	}

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
	assert.Equal(t, "PQVP", title)
}
