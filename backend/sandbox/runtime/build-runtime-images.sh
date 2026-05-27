#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"

build_if_missing() {
  image="$1"
  context_dir="$2"

  if docker image inspect "$image" >/dev/null 2>&1; then
    echo "[sandbox-runtime] reuse $image"
    return
  fi

  echo "[sandbox-runtime] build $image"
  docker build -t "$image" "$context_dir"
}

build_if_missing "edu-ai-sandbox-python:latest" "$ROOT_DIR/python"
build_if_missing "edu-ai-sandbox-javascript:latest" "$ROOT_DIR/javascript"
build_if_missing "edu-ai-sandbox-typescript:latest" "$ROOT_DIR/typescript"
build_if_missing "edu-ai-sandbox-go:latest" "$ROOT_DIR/go"
build_if_missing "edu-ai-sandbox-java:latest" "$ROOT_DIR/java"
build_if_missing "edu-ai-sandbox-c:latest" "$ROOT_DIR/c"
build_if_missing "edu-ai-sandbox-cpp:latest" "$ROOT_DIR/cpp"
build_if_missing "edu-ai-sandbox-rust:latest" "$ROOT_DIR/rust"
build_if_missing "edu-ai-sandbox-csharp:latest" "$ROOT_DIR/csharp"
build_if_missing "edu-ai-sandbox-terminal-bash:latest" "$ROOT_DIR/terminal-bash"
