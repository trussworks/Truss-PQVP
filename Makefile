NAME = pqvp-demo

client_build:
	cd client && \
	npm run-script prod
docs:
	bootprint openapi server/docs/swagger.yaml client/dist/docs
server_deps:
	cd server && \
	glide install
server_build: server_deps
	cd server && \
	go build
server_test: server_build
	cd server && \
	go vet && \
	go test -cover
server_run: server_build server_test
	./server/server \
		-entry client/dist/index.html \
		-static client/dist/ \
		-docs client/dist/docs/ \
		-port :8080
local_docker: client_build
	bin/local-docker.sh $(NAME)

.PHONY: client_build docs server_deps server_build server_test server_run local_docker
