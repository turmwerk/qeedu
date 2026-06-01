"""LLM client factory — creates an OpenAI-compatible client with key rotation."""

from openai import OpenAI
from configs.llm import (
    resolve_provider,
)
import logging

logger = logging.getLogger(__name__)


def create_client(key: str, base_url: str, headers: dict[str, str] | None = None) -> OpenAI:
    """Create an OpenAI-compatible client."""
    return OpenAI(
        api_key=key,
        base_url=base_url,
        default_headers=headers or None,
    )


def _is_rate_limit(exc: Exception) -> bool:
    """Return True if the exception is an HTTP 429 (rate limit)."""
    if hasattr(exc, "status_code"):
        return getattr(exc, "status_code") == 429
    if hasattr(exc, "response"):
        resp = getattr(exc, "response", None)
        if resp is not None and getattr(resp, "status_code", None) == 429:
            return True
    return "429" in str(exc) or "rate" in str(exc).lower()


def create_with_retry(model: str, messages: list, **kwargs):
    """Call chat.completions.create using the provider resolved for the model."""
    api_key = str(kwargs.pop("api_key", "") or "")
    base_url = str(kwargs.pop("base_url", "") or "")
    provider_cfg = resolve_provider(model=model, api_key=api_key, base_url=base_url)
    if not provider_cfg.api_key or not provider_cfg.base_url:
        raise RuntimeError("No provider credentials configured for copilot model.")

    client = create_client(
        key=provider_cfg.api_key,
        base_url=provider_cfg.base_url,
        headers=provider_cfg.headers,
    )
    return client.chat.completions.create(
        model=model,
        messages=messages,
        **kwargs,
    )
