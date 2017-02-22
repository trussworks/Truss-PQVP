#!/usr/bin/env bash
set -eux -o pipefail

# start postgres and create pvqp user
/etc/init.d/postgresql start

su postgres -c "psql < /go/src/app/server/sql/init.sql"

/go/src/app/server/server -entry /go/src/app/client/dist/index.html -static /go/src/app/client/dist/
