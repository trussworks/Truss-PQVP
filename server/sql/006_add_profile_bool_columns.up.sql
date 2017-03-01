ALTER TABLE profiles ADD COLUMN alert_phone boolean DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN alert_email boolean DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN urgent_only boolean DEFAULT FALSE;
