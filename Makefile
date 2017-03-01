NAME = pqvp-demo
GOPATH := $(CURDIR)/server:$(GOPATH)

client_build:
	cd client && \
	npm run-script prod
docs:
	bootprint openapi server/docs/swagger.yaml client/dist/docs
server_deps:
	cd server/src/pqvp && \
	glide install
server_build: server_deps
	cd server/src/pqvp && \
	go build
server_test: server_build
	cd server/src/pqvp && \
	go vet && \
	go test -cover
server_run: server_build server_test
	./server/src/pqvp/pqvp \
		-entry client/dist/index.html \
		-static client/dist/ \
		-docs client/dist/docs/ \
		-port :8080
selenium_test:
	cd server/src/pqvp/selenium && \
	go test
local_docker: client_build
	bin/local-docker.sh $(NAME)

.PHONY: client_build docs server_deps server_build server_test server_run local_docker
