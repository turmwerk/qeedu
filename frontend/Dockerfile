FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend ./
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
ENV WEB_PORT=80
ENV API_UPSTREAM=http://gateway:8080
COPY docker/web-server.mjs ./web-server.mjs
COPY --from=builder /app/dist ./dist
EXPOSE 80
CMD ["node", "web-server.mjs"]
