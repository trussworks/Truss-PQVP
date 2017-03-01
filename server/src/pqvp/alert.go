package main

import (
	"sync/atomic"

	"github.com/tj/go-sms"
	"github.com/ttacon/libphonenumber"
	"go.uber.org/zap"
)

// SendSMS uses AWS SNS to send SMS messages to a list of phone numbers
// Return the number of successful sends
func SendSMS(phoneNumbers []string, message string) int {
	var successes uint32 = 0

	// Send SMS messages
	// TODO use channels to speed up throughput
	for i, _ := range phoneNumbers {
		phoneNumber, err := libphonenumber.Parse(phoneNumbers[i], "US")
		if err != nil {

			logger.Error("Unable to parse phone number",
				zap.String("phone", phoneNumbers[i]),
				zap.Error(err),
			)
		}
		formattedNumber := libphonenumber.Format(phoneNumber, libphonenumber.INTERNATIONAL)
		logger.Info("Sending SMS",
			zap.String("phone", formattedNumber),
		)
		err = sms.Send(message, formattedNumber)
		if err != nil {
			logger.Error("SMS send failed",
				zap.String("phone", formattedNumber),
				zap.Error(err),
			)
		} else {
			atomic.AddUint32(&successes, 1)
		}

	}

	return int(atomic.LoadUint32(&successes))
}
