# QeEdu Community Edition Docker Deployment

This directory provides the portable Community Edition deployment for QeEdu.
It follows the same operational shape as Dify: keep a safe `.env.example`,
store local secrets in `.env`, run the stack with Docker Compose, and keep
persistent data in named volumes.

## Quick Start

```bash
cd docker
cp .env.example .env
docker compose up -d --build
```

Open:

- Web: http://localhost:3000
- API health: http://localhost:8080/health

## Required Configuration

Edit `docker/.env` before production use:

- `JWT_SECRET`: set a long random string.
- `MYSQL_ROOT_PASSWORD`: replace the default password.
- `DATABASE_DSN`: keep it aligned with `MYSQL_ROOT_PASSWORD` and `MYSQL_DATABASE`.
- `FRONTEND_URL`: set the public cloud URL, for example `https://cloud.example.edu`.
- `GITHUB_CALLBACK_URL`, `GOOGLE_CALLBACK_URL`, `MICROSOFT_CALLBACK_URL`: set provider callback URLs if OAuth is enabled.
- `LLM_API_KEY` or `OPENAI_API_KEY`: set an OpenAI-compatible provider key if AI calls should work without local CLI fallback.

## Services

- `web`: built frontend served by a small Node static server. It proxies `/api/` and `/uploads/` to `gateway`.
- `gateway`: public REST and WebSocket API.
- `user-services`: user account gRPC service.
- `sandbox`: code runner and LSP gRPC service. It needs `/var/run/docker.sock`.
- `ai-chat`: streaming chat and fix-bug gRPC service.
- `ai-copilot`: code completion gRPC service.
- `mysql`: default CE database.

## Upgrade Pattern

Before upgrading:

```bash
cd docker
docker compose down
docker compose config > compose.backup.yaml
docker run --rm -v qeedu-ce_qeedu-mysql-data:/data -v "$PWD":/backup alpine tar czf /backup/mysql-data.tgz /data
docker compose up -d --build
```

Keep `.env` local. When `.env.example` changes, review new variables and copy
only the needed values into `.env`.
