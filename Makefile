NAME = pqvp-demo

server_build:
	cd server && glide install && go build
server_test: server_build
	cd server && go test
local_docker:
	docker build -t pqvp-demo .
	$(if $(shell docker ps -q -f "name=$(NAME)"), docker rm -f $(shell docker ps -q -f "name=$(NAME)"))
	docker run -d -p 80:80 --name $(NAME) $(NAME)
