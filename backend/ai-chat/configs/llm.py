"""LLM provider configuration with per-provider credentials.

Loads settings from a centralized JSON config file (configs/llm.json at the
backend root). Environment variables can still override individual fields.

The built-in model strategy is intentionally small:
- default chat/fix model: ``deepseek-v4-flash`` via DeepSeek
- alternate fast model: one OpenRouter model

Custom model requests may override API key and base URL from the frontend.
"""

import json
import os
from pathlib import Path

_CONFIG_PATH = Path(os.getenv("LLM_CONFIG_PATH", "/app/configs/llm.json"))

_cfg: dict = {}
if _CONFIG_PATH.exists():
    with open(_CONFIG_PATH, encoding="utf-8") as f:
        _cfg = json.load(f)

_chat_cfg: dict = (_cfg.get("models") or {}).get("chat", {})
_fixbug_cfg: dict = (_cfg.get("models") or {}).get("fixbug", {})
_extra_headers: dict = _cfg.get("extra_headers", {})
_providers_cfg: dict = _cfg.get("providers", {})
_deepseek_cfg: dict = _providers_cfg.get("deepseek", {})
_openrouter_cfg: dict = _providers_cfg.get("openrouter", {})


def _env_or_cfg(env_names: tuple[str, ...], cfg: dict, key: str, default: str = "") -> str:
    for env_name in env_names:
        value = os.getenv(env_name)
        if value and value.strip():
            return value.strip()
    value = cfg.get(key, default)
    return value.strip() if isinstance(value, str) else default


DEEPSEEK_API_KEY: str = _env_or_cfg(("DEEPSEEK_API_KEY",), _deepseek_cfg, "api_key")
DEEPSEEK_BASE_URL: str = _env_or_cfg(
    ("DEEPSEEK_BASE_URL",),
    _deepseek_cfg,
    "base_url",
    "https://api.deepseek.com",
)

OPENROUTER_API_KEY: str = _env_or_cfg(
    ("OPENROUTER_API_KEY", "LLM_API_KEY", "OPENAI_API_KEY"),
    _openrouter_cfg,
    "api_key",
)
if not OPENROUTER_API_KEY:
    api_keys = _cfg.get("api_keys", [])
    if api_keys:
        OPENROUTER_API_KEY = str(api_keys[0]).strip()
OPENROUTER_BASE_URL: str = _env_or_cfg(
    ("OPENROUTER_BASE_URL", "LLM_BASE_URL", "OPENAI_BASE_URL"),
    _openrouter_cfg,
    "base_url",
    "https://openrouter.ai/api/v1",
)
if OPENROUTER_BASE_URL == "https://openrouter.ai/api/v1":
    OPENROUTER_BASE_URL = os.getenv("LLM_BASE_URL") or os.getenv("OPENAI_BASE_URL") or _cfg.get("base_url", "https://openrouter.ai/api/v1")

DEFAULT_CHAT_MODEL: str = os.getenv(
    "LLM_CHAT_MODEL", _chat_cfg.get("model", "deepseek-v4-flash")
).strip()


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

FIXBUG_MODEL: str = os.getenv(
    "LLM_FIX_MODEL", _fixbug_cfg.get("model", DEFAULT_CHAT_MODEL)
).strip()
FIXBUG_TEMPERATURE: float = _get_float(
    "FIXBUG_TEMPERATURE", _fixbug_cfg.get("temperature", 0.3)
)
FIXBUG_MAX_TOKENS: int = _get_int(
    "FIXBUG_MAX_TOKENS", _fixbug_cfg.get("max_tokens", 4096)
)

LLM_EXTRA_HEADERS: dict[str, str] = {
    k: os.getenv(k.replace("-", "_").upper(), v)
    for k, v in _extra_headers.items()
}


class ProviderConfig(dict):
    @property
    def provider(self) -> str:
        return self.get("provider", "")

    @property
    def api_key(self) -> str:
        return self.get("api_key", "")

    @property
    def base_url(self) -> str:
        return self.get("base_url", "")

    @property
    def headers(self) -> dict[str, str]:
        return self.get("headers", {})


def resolve_provider(model: str = "", api_key: str = "", base_url: str = "") -> ProviderConfig:
    """Resolve credentials/base URL for a request."""
    chosen_model = (model or DEFAULT_CHAT_MODEL).strip()

    if api_key:
        custom_url = (base_url or OPENROUTER_BASE_URL).strip()
        return ProviderConfig(
            provider="custom",
            api_key=api_key.strip(),
            base_url=custom_url,
            headers=LLM_EXTRA_HEADERS if "openrouter.ai" in custom_url.lower() else {},
        )

    if chosen_model == "deepseek-v4-flash":
        return ProviderConfig(
            provider="deepseek",
            api_key=DEEPSEEK_API_KEY,
            base_url=DEEPSEEK_BASE_URL,
            headers={},
        )

    return ProviderConfig(
        provider="openrouter",
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_BASE_URL,
        headers=LLM_EXTRA_HEADERS,
    )


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
