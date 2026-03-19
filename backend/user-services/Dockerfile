FROM golang:1.24-alpine AS builder
WORKDIR /src
ENV GOPROXY=https://goproxy.cn,direct
ENV http_proxy="" https_proxy="" all_proxy=""
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /user-services ./user-services/cmd/server

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
COPY --from=builder /user-services /user-services
EXPOSE 50051
ENTRYPOINT ["/user-services"]
