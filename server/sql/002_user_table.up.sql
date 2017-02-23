CREATE TABLE users (
       id    SERIAL PRIMARY KEY,
       email text NOT NULL,
       password_hash text
);
GRANT ALL PRIVILEGES ON TABLE users TO pqvp;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pqvp;
