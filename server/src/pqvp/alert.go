package main

import (
	"sync/atomic"

	"github.com/tj/go-sms"
	"go.uber.org/zap"
)

// SendSMS uses AWS SNS to send SMS messages to a list of phone numbers
func SendSMS(phoneNumbers []string, message string) int {
	var successes uint32 = 0

	// Send SMS messages
	for i, _ := range phoneNumbers {
		phoneNumber := phoneNumbers[i]
		go func() {
			err := sms.Send(message, phoneNumber)
			if err != nil {
				logger.Error("SMS send failed",
					zap.String("phone", phoneNumber),
					zap.Error(err),
				)
			}
			atomic.AddUint32(&successes, 1)

		}()
	}

	return int(atomic.LoadUint32(&successes))
}
