NAME = pqvp-demo

server:
	cd server && \
	glide install && \
	go test && \
	go build
local_docker:
	docker build -t pqvp-demo .
	$(if $(shell docker ps -q -f "name=$(NAME)"), docker rm -f $(shell docker ps -q -f "name=$(NAME)"))
	docker run -d -p 80:80 --name $(NAME) $(NAME)

.PHONY: server
