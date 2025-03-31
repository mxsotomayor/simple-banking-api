build:
	docker build . -t banking-test-api

run:
	docker run -p8080:9001 banking-test-api