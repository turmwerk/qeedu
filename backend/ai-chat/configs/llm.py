"""LLM provider configuration.

Supports any OpenAI-compatible API. Switch vendors by changing env vars:
  - OpenAI:   LLM_BASE_URL=https://api.openai.com/v1    LLM_MODEL=gpt-4o-mini
  - DeepSeek: LLM_BASE_URL=https://api.deepseek.com/v1  LLM_MODEL=deepseek-chat
  - Ollama:   LLM_BASE_URL=http://localhost:11434/v1     LLM_MODEL=codellama
  - Azure:    LLM_BASE_URL=https://<name>.openai.azure.com/...
"""

import os

# ── Provider identity ───────────────────────────────
LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")

# ── Connection ──────────────────────────────────────
LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")

# ── Model selection ─────────────────────────────────
LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")

# ── Generation parameters ───────────────────────────
LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.7"))
LLM_MAX_TOKENS: int = int(os.getenv("LLM_MAX_TOKENS", "2048"))
