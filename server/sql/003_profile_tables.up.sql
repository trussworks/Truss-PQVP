CREATE TABLE profiles (
       id SERIAL PRIMARY KEY,
       phone TEXT NOT NULL,
       user_id INTEGER NOT NULL
);

CREATE TABLE addresses (
       id SERIAL PRIMARY KEY,
       address TEXT NOT NULL,
       point GEOMETRY(POINT,4326),
       profile_id INTEGER NOT NULL
);
