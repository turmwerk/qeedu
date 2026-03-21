COMPOSE := docker compose -f ./deploy/docker-compose.yml

.PHONY: up down build logs restart proto tidy runtime-images pull-images

# 启动全部服务（后台运行）
up:
	$(COMPOSE) up -d --build

# 停止全部服务
down:
	$(COMPOSE) down

# 仅构建镜像，不启动
build:
	$(COMPOSE) build

# 查看日志（实时跟踪）
logs:
	$(COMPOSE) logs -f

# 重启全部服务
restart:
	$(COMPOSE) restart

# 生成 protobuf 代码（输出到 pkg/pb/）
proto:
	MSYS_NO_PATHCONV=1 docker run --rm \
		-v "$(CURDIR):/workspace" \
		-v "$(HOME)/go/bin:/go-plugins" \
		-w "/workspace" \
		--entrypoint sh \
		namely/protoc-all:1.51_2 \
		-c 'PATH="/go-plugins:$$PATH" && protoc --proto_path=proto \
			--go_out=pkg/pb --go_opt=paths=source_relative \
			--go-grpc_out=pkg/pb --go-grpc_opt=paths=source_relative \
			sandbox/v1/runner.proto sandbox/v1/terminal.proto sandbox/v1/lsp.proto \
			user/v1/user.proto \
			ai-chat/v1/ai-chat.proto \
			ai-copilot/v1/ai-copilot.proto'

# 整理依赖
tidy:
	go mod tidy

# 构建沙盒运行时镜像
runtime-images:
	sh ./sandbox/runtime/build-runtime-images.sh

# 兼容旧命令
pull-images: runtime-images
