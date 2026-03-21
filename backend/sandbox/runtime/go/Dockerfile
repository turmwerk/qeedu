FROM golang:1.23-alpine

ENV CGO_ENABLED=0 \
    GOCACHE=/root/.cache/go-build \
    GOPATH=/go

WORKDIR /code

RUN mkdir -p /root/.cache/go-build /tmp/go-warm \
    && printf 'package main\nimport "fmt"\nfunc main(){fmt.Println("warm")}\n' > /tmp/go-warm/main.go \
    && go build -trimpath -o /tmp/go-warm/main /tmp/go-warm/main.go \
    && rm -rf /tmp/go-warm
