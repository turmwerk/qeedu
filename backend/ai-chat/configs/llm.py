"""LLM provider configuration with API key rotation.

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

_chat_cfg: dict = (_cfg.get("models") or {}).get("chat", {})
_fixbug_cfg: dict = (_cfg.get("models") or {}).get("fixbug", {})
_extra_headers: dict = _cfg.get("extra_headers", {})

# ── Provider identity ───────────────────────────────
LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", _cfg.get("provider", "openrouter")).strip().lower()

# ── Connection ──────────────────────────────────────
# Single key override via env var (backwards-compatible)
LLM_API_KEY: str = (
    os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY") or ""
).strip()

# Multiple keys loaded from JSON config.
LLM_API_KEYS: list[str] = _cfg.get("api_keys", [])
if LLM_API_KEY and LLM_API_KEY not in LLM_API_KEYS:
    LLM_API_KEYS.insert(0, LLM_API_KEY)
# Filter out empty strings.
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
    """Return the current API key (no rotation)."""
    global _key_index
    if not LLM_API_KEYS:
        return ""
    with _key_lock:
        idx = _key_index % len(LLM_API_KEYS)
    return LLM_API_KEYS[idx]


def rotate_api_key() -> bool:
    """Advance to the next API key. Returns False if only one key exists."""
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
    "LLM_MODEL", _chat_cfg.get("model", "deepseek/deepseek-v4-flash:free")
).strip()

# ── Generation parameters ───────────────────────────
def _get_float(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, str(default)))
    except ValueError:
        return default

def _get_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default

LLM_TEMPERATURE: float = _get_float("LLM_TEMPERATURE", _chat_cfg.get("temperature", 0.7))
LLM_MAX_TOKENS: int = _get_int("LLM_MAX_TOKENS", _chat_cfg.get("max_tokens", 4096))

# ── FixBug model (can differ from chat) ─────────────
FIXBUG_MODEL: str = os.getenv(
    "FIXBUG_MODEL", _fixbug_cfg.get("model", LLM_MODEL)
).strip()
FIXBUG_TEMPERATURE: float = _get_float(
    "FIXBUG_TEMPERATURE", _fixbug_cfg.get("temperature", 0.3)
)
FIXBUG_MAX_TOKENS: int = _get_int(
    "FIXBUG_MAX_TOKENS", _fixbug_cfg.get("max_tokens", 4096)
)

# ── Extra headers for OpenRouter ────────────────────
LLM_EXTRA_HEADERS: dict[str, str] = {
    k: os.getenv(k.replace("-", "_").upper(), v)
    for k, v in _extra_headers.items()
}

# ── Local CLI fallback ──────────────────────────────
LLM_FALLBACK_PROVIDER: str = os.getenv("LLM_FALLBACK_PROVIDER", "auto").strip().lower()
LLM_CLI_TIMEOUT_SECONDS: int = _get_int("LLM_CLI_TIMEOUT_SECONDS", 240)
LLM_CLI_CHUNK_SIZE: int = _get_int("LLM_CLI_CHUNK_SIZE", 96)

CODEX_BIN: str = os.getenv("CODEX_BIN", "codex").strip()
CODEX_MODEL: str = os.getenv("CODEX_MODEL", "").strip()
CODEX_WORKDIR: str = os.getenv("CODEX_WORKDIR", "/tmp").strip()
CODEX_SANDBOX: str = os.getenv("CODEX_SANDBOX", "read-only").strip()
CODEX_HOME: str = os.getenv("CODEX_HOME", "").strip()
CODEX_REASONING_EFFORT: str = os.getenv("CODEX_REASONING_EFFORT", "low").strip()
CODEX_REASONING_SUMMARY: str = os.getenv("CODEX_REASONING_SUMMARY", "none").strip()
CODEX_VERBOSITY: str = os.getenv("CODEX_VERBOSITY", "low").strip()

CLAUDE_BIN: str = os.getenv("CLAUDE_BIN", "claude").strip()
CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "").strip()
