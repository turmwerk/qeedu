"""LLM client factory — creates an OpenAI-compatible client with key rotation."""

from openai import OpenAI
from configs.llm import (
    LLM_BASE_URL,
    LLM_EXTRA_HEADERS,
    get_api_key,
    key_count,
    rotate_api_key,
)
import logging

logger = logging.getLogger(__name__)


def create_client(key: str = "") -> OpenAI:
    """Create an OpenAI-compatible client. Uses the current rotation key if none given."""
    return OpenAI(
        api_key=key or get_api_key(),
        base_url=LLM_BASE_URL,
        default_headers=LLM_EXTRA_HEADERS or None,
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
    """Call chat.completions.create with automatic key rotation on 429.

    Returns the completion response.
    """
    total_keys = max(key_count(), 1)
    for attempt in range(total_keys):
        client = create_client()
        try:
            return client.chat.completions.create(
                model=model,
                messages=messages,
                **kwargs,
            )
        except Exception as e:
            if _is_rate_limit(e) and rotate_api_key():
                logger.warning(
                    "Rate limited (attempt %d/%d), rotating API key...",
                    attempt + 1, total_keys,
                )
                continue
            raise
    raise RuntimeError(f"All {total_keys} API keys are rate-limited.")
