FROM golang:1.24-alpine AS builder
WORKDIR /src
ENV GOPROXY=https://goproxy.cn,https://proxy.golang.org,direct
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go mod tidy && CGO_ENABLED=0 go build -o /sandbox ./sandbox/cmd/server

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata docker-cli
COPY --from=builder /sandbox /sandbox
COPY sandbox/runtime /sandbox-runtime
RUN chmod +x /sandbox-runtime/entrypoint.sh /sandbox-runtime/build-runtime-images.sh
EXPOSE 50052
ENTRYPOINT ["/sandbox-runtime/entrypoint.sh"]
