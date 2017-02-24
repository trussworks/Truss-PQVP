NAME = pqvp-demo

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
local_docker:
	docker build -t pqvp-demo .
	$(if $(shell docker ps -q -f "name=$(NAME)"), docker rm -f $(shell docker ps -q -f "name=$(NAME)"))
	docker run -d -p 80:80 --name $(NAME) $(NAME)

.PHONY: server
