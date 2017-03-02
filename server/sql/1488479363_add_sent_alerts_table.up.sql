CREATE TABLE sent_alerts (
       id SERIAL PRIMARY KEY,
       message TEXT NOT NULL,
       sent_sms INTEGER NOT NULL,
       sent_email INTEGER NOT NULL,
       sent_people INTEGER NOT NULL,
       geo GEOMETRY(GEOMETRY, 4326) NOT NULL,
       sender TEXT NOT NULL,
       severity TEXT NOT NULL
);
GRANT ALL PRIVILEGES ON TABLE sent_alerts TO pqvp;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pqvp;
