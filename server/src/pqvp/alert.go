package main

import (
	"os"
	"sync/atomic"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/tj/go-sms"
	"github.com/ttacon/libphonenumber"
	"go.uber.org/zap"
)

// SendSMS uses AWS SNS to send SMS messages to a list of phone numbers
// Return the number of successful sends
func SendSMS(phoneNumbers []string, message string) int {
	var successes uint32

	// Send SMS messages
	// TODO use channels to speed up throughput
	for i := range phoneNumbers {
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

// SendEmail uses SendGrid to send emails to a list addresses
// Return the number of successful sends
func SendEmail(emailAddresses []string, message string) int {
	var successes uint32

	// TODO use channels to speed up throughput
	for _, emailAddress := range emailAddresses {
		// TODO fix DMARC policies to send from alert@pqvp.truss.works
		from := mail.NewEmail("Emergency Alert App", "test@example.com")
		subject := "Emergency Alert Notification"
		to := mail.NewEmail(emailAddress, emailAddress)
		content := mail.NewContent("text/plain", message)
		m := mail.NewV3MailInit(from, subject, to, content)

		request := sendgrid.GetRequest(os.Getenv("SENDGRID_API_KEY"), "/v3/mail/send", "https://api.sendgrid.com")
		request.Method = "POST"
		request.Body = mail.GetRequestBody(m)
		response, err := sendgrid.API(request)
		if err != nil {
			logger.Error("Email send failed",
				zap.String("email", emailAddress),
				zap.Error(err),
			)
		} else {
			logger.Info("Sent email:",
				zap.Int("status code", response.StatusCode),
				zap.String("status body", response.Body),
			)
			atomic.AddUint32(&successes, 1)
		}
	}
	return int(atomic.LoadUint32(&successes))
}
