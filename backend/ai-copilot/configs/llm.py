"""LLM provider configuration for AI Copilot with per-provider credentials."""

import json
import os
from pathlib import Path

_CONFIG_PATH = Path(os.getenv("LLM_CONFIG_PATH", "/app/configs/llm.json"))

_cfg: dict = {}
if _CONFIG_PATH.exists():
    with open(_CONFIG_PATH, encoding="utf-8") as f:
        _cfg = json.load(f)

_copilot_cfg: dict = (_cfg.get("models") or {}).get("copilot", {})
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

DEFAULT_COPILOT_MODEL: str = os.getenv(
    "LLM_COPILOT_MODEL", _copilot_cfg.get("model", "deepseek-v4-flash")
).strip()

LLM_TEMPERATURE: float = float(
    os.getenv("LLM_TEMPERATURE", str(_copilot_cfg.get("temperature", 0.2)))
)
LLM_MAX_TOKENS: int = int(
    os.getenv("LLM_MAX_TOKENS", str(_copilot_cfg.get("max_tokens", 512)))
)

LLM_EXTRA_HEADERS: dict[str, str] = {
    k: os.getenv(k.replace("-", "_").upper(), v)
    for k, v in _extra_headers.items()
}


class ProviderConfig(dict):
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
    chosen_model = (model or DEFAULT_COPILOT_MODEL).strip()

    if api_key:
        custom_url = (base_url or OPENROUTER_BASE_URL).strip()
        return ProviderConfig(
            api_key=api_key.strip(),
            base_url=custom_url,
            headers=LLM_EXTRA_HEADERS if "openrouter.ai" in custom_url.lower() else {},
        )

    if chosen_model == "deepseek-v4-flash":
        return ProviderConfig(
            api_key=DEEPSEEK_API_KEY,
            base_url=DEEPSEEK_BASE_URL,
            headers={},
        )

    return ProviderConfig(
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_BASE_URL,
        headers=LLM_EXTRA_HEADERS,
    )
