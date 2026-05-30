"""LLM provider configuration for AI Copilot with API key rotation.

Loads settings from a centralized JSON config file (configs/llm.json at the
backend root).  Environment variables can still override individual fields.

Supports multiple API keys via the ``api_keys`` array — when the current key
hits a rate limit the client rotates to the next key.
"""

import json
import os
import threading
from pathlib import Path

_CONFIG_PATH = Path(os.getenv("LLM_CONFIG_PATH", "/app/configs/llm.json"))

_cfg: dict = {}
if _CONFIG_PATH.exists():
    with open(_CONFIG_PATH, encoding="utf-8") as f:
        _cfg = json.load(f)

_copilot_cfg: dict = (_cfg.get("models") or {}).get("copilot", {})
_extra_headers: dict = _cfg.get("extra_headers", {})

# ── Provider identity ───────────────────────────────
LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", _cfg.get("provider", "openrouter")).strip().lower()

# ── Connection ──────────────────────────────────────
LLM_API_KEY: str = (
    os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY") or ""
).strip()

LLM_API_KEYS: list[str] = _cfg.get("api_keys", [])
if LLM_API_KEY and LLM_API_KEY not in LLM_API_KEYS:
    LLM_API_KEYS.insert(0, LLM_API_KEY)
LLM_API_KEYS = [k.strip() for k in LLM_API_KEYS if k and k.strip()]

LLM_BASE_URL: str = (
    os.getenv("LLM_BASE_URL")
    or os.getenv("OPENAI_BASE_URL")
    or _cfg.get("base_url", "https://openrouter.ai/api/v1")
).strip()

# ── API key rotation ────────────────────────────────
_key_index: int = 0
_key_lock = threading.Lock()


def get_api_key() -> str:
    if not LLM_API_KEYS:
        return ""
    with _key_lock:
        idx = _key_index % len(LLM_API_KEYS)
    return LLM_API_KEYS[idx]


def rotate_api_key() -> bool:
    global _key_index
    if len(LLM_API_KEYS) <= 1:
        return False
    with _key_lock:
        _key_index = (_key_index + 1) % len(LLM_API_KEYS)
    return True


def key_count() -> int:
    return len(LLM_API_KEYS)


# ── Model selection ─────────────────────────────────
LLM_MODEL: str = os.getenv(
    "LLM_MODEL", _copilot_cfg.get("model", "deepseek/deepseek-v4-flash:free")
).strip()

# ── Generation parameters (low temp for code completion) ─
LLM_TEMPERATURE: float = float(
    os.getenv("LLM_TEMPERATURE", str(_copilot_cfg.get("temperature", 0.2)))
)
LLM_MAX_TOKENS: int = int(
    os.getenv("LLM_MAX_TOKENS", str(_copilot_cfg.get("max_tokens", 512)))
)

# ── Extra headers for OpenRouter ────────────────────
LLM_EXTRA_HEADERS: dict[str, str] = {
    k: os.getenv(k.replace("-", "_").upper(), v)
    for k, v in _extra_headers.items()
}
