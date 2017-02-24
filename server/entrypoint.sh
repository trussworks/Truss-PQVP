#!/usr/bin/env bash
set -eux -o pipefail

# start postgres and create pvqp user
/etc/init.d/postgresql start

# run migrations
su postgres -c "createdb pqvp"
su postgres -c "psql -c \"ALTER USER postgres PASSWORD '';\""
/go/bin/migrate -url "postgres://postgres@localhost:5432/pqvp?sslmode=disable" -path /go/src/app/server/sql up

/go/src/app/server/server \
    -entry /go/src/app/client/dist/index.html \
    -static /go/src/app/client/dist/ \
    -docs /go/src/app/client/dist/docs/
