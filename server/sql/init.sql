drop user if exists pqvp;
create user pqvp with password 'pqvp';
create database pqvp;
grant all privileges on database pqvp to pqvp;
create extension postgis;
