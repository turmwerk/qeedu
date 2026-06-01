"""Completion service — code completion via LLM."""

import logging

from app.llm.client import create_with_retry
from app.llm.prompt import COMPLETION_SYSTEM, build_completion_prompt
from configs.llm import DEFAULT_COPILOT_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS

logger = logging.getLogger(__name__)


def complete(
    language: str,
    file_content: str,
    cursor_offset: int,
    file_path: str = "",
    model: str = "",
    api_key: str = "",
    base_url: str = "",
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> str:
    prompt = build_completion_prompt(language, file_content, cursor_offset)

    resp = create_with_retry(
        model or DEFAULT_COPILOT_MODEL,
        [
            {"role": "system", "content": COMPLETION_SYSTEM},
            {"role": "user", "content": prompt},
        ],
        max_tokens=max_tokens if max_tokens is not None and max_tokens > 0 else LLM_MAX_TOKENS,
        temperature=temperature if temperature is not None else LLM_TEMPERATURE,
        stop=["\n\n\n"],
        api_key=api_key,
        base_url=base_url,
    )

    suggestion = resp.choices[0].message.content or ""
    return suggestion.strip()
