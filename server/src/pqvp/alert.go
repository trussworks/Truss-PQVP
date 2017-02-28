package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/paulmach/go.geojson"
)

//Alert stores the message, severity and GeoJSON for a given emergency
type Alert struct {
	Geo      *geojson.Feature `json:"geojson"`
	Message  string           `json:"message"`
	Severity string           `json:"severity"`
}

// SendAlert looks up affected users inside an the alert geometry
// and sends SMS messages with the message
func SendAlert(w http.ResponseWriter, r *http.Request) {
	//alert := dummyAlert()
	var alert Alert
	err := json.NewDecoder(r.Body).Decode(&alert)
	// handle incorrect JSON
	if err != nil {
		http.Error(w, http.StatusText(400), http.StatusBadRequest)
		return
	}
	numbers, err := FindRecipients(alert.Geo.Geometry)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("Unable to find recipients: %s", err)
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		} else {
			fmt.Printf("Error finding recipients: %s", err)
			http.Error(w, http.StatusText(500), http.StatusInternalServerError)

		}
		return
	}
	// TODO Replace with SNS calls
	fmt.Printf("Impacted recipients: %s\n", numbers)
}

// FindRecipients handle the actual PostGIS query
// looking for all addresses inside the alert geometry
func FindRecipients(geo *geojson.Geometry) ([]string, error) {
	db := GetDB()
	json, err := geo.MarshalJSON()
	if err != nil {
		return nil, err
	}

	// Look for the phone numbers that having addresses in the alert geometry
	// Right now we assume the GeoJSON geometry is a polygon
	query := `
SELECT DISTINCT p.phone
FROM Addresses a, Profiles p
WHERE ST_Intersects(a.point, ST_SetSRID(ST_GeomFromGeoJSON($1),4326))
AND a.profile_id = p.id`

	rows, err := db.Query(query, json)
	defer rows.Close()

	var phoneNumbers []string
	for rows.Next() {
		var phoneNumber string
		err = rows.Scan(&phoneNumber)
		phoneNumbers = append(phoneNumbers, phoneNumber)
		fmt.Printf("Found %s\n", phoneNumber)
	}
	if err != nil {
		fmt.Printf("DB Error %s:", err)
		return nil, err

	}

	return phoneNumbers, nil
}
