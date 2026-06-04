# QeEdu Community Edition Docker Deployment

This directory provides the portable Community Edition deployment for QeEdu.
It follows the same operational shape as Dify: keep a safe `.env.example`,
store local secrets in `.env`, run the stack with Docker Compose, and keep
persistent data in named volumes.

## Quick Start

For local validation or development, build images from the checked-out source:

```bash
cd docker
cp .env.example .env
docker compose up -d --build
```

Open:

- Web: http://localhost:3000
- API health: http://localhost:8080/health

## Release Image Deployment

For a Dify-like CE release, use the prebuilt images published to GHCR:

```bash
git fetch --tags
git checkout v0.1.0
cd docker
cp .env.example .env
# Edit QEEDU_VERSION to the same released tag, for example v0.1.0.
docker compose -f docker-compose.release.yaml pull
docker compose -f docker-compose.release.yaml up -d
```

`docker-compose.release.yaml` pulls:

- `ghcr.io/turmwerk/qeedu-web:${QEEDU_VERSION}`
- `ghcr.io/turmwerk/qeedu-gateway:${QEEDU_VERSION}`
- `ghcr.io/turmwerk/qeedu-user-services:${QEEDU_VERSION}`
- `ghcr.io/turmwerk/qeedu-sandbox:${QEEDU_VERSION}`
- `ghcr.io/turmwerk/qeedu-ai-chat:${QEEDU_VERSION}`
- `ghcr.io/turmwerk/qeedu-ai-copilot:${QEEDU_VERSION}`

GitHub Release assets should stay as source archives and release notes. Docker
images are not uploaded as release attachments; they are published to the
container registry by `.github/workflows/ce-docker-images.yml` when a `v*` tag
is pushed. If anonymous CE deployment is expected, make the generated GHCR
packages public after the first successful publish.

## Required Configuration

Edit `docker/.env` before production use:

- `QEEDU_VERSION`: set the release tag to deploy, for example `v0.1.0`.
- `QEEDU_IMAGE_PREFIX`: keep `ghcr.io/turmwerk` unless using a private mirror.
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

## Release Publishing

To publish a CE release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The tag triggers the CE image workflow and publishes versioned images to GHCR.
Then create a GitHub Release from the same tag with release notes and upgrade
instructions. This mirrors Dify's approach: release notes live on GitHub,
deployable images live in a registry, and users deploy by selecting a version
tag in `.env`.

The workflow template is stored at `docker/ce-docker-images.workflow.example.yml`.
Activate it when the GitHub credential used to push this repository has the
`workflow` scope:

```bash
mkdir -p .github/workflows
cp docker/ce-docker-images.workflow.example.yml .github/workflows/ce-docker-images.yml
git add .github/workflows/ce-docker-images.yml
git commit -m "ci: publish ce docker images"
git push origin main
```

## Upgrade Pattern

Before upgrading:

```bash
cd docker
docker compose down
docker compose config > compose.backup.yaml
docker run --rm -v qeedu-ce_qeedu-mysql-data:/data -v "$PWD":/backup alpine tar czf /backup/mysql-data.tgz /data
docker compose -f docker-compose.release.yaml pull
docker compose -f docker-compose.release.yaml up -d
```

Keep `.env` local. When `.env.example` changes, review new variables and copy
only the needed values into `.env`.

For source-build deployments, replace the last two commands with:

```bash
docker compose up -d --build
```
