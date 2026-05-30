"""Completion service — code completion via LLM."""

import logging

from app.llm.client import create_with_retry
from app.llm.prompt import COMPLETION_SYSTEM, build_completion_prompt
from configs.llm import LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS

logger = logging.getLogger(__name__)


def complete(
    language: str,
    file_content: str,
    cursor_offset: int,
    file_path: str = "",
) -> str:
    prompt = build_completion_prompt(language, file_content, cursor_offset)

    resp = create_with_retry(
        LLM_MODEL,
        [
            {"role": "system", "content": COMPLETION_SYSTEM},
            {"role": "user", "content": prompt},
        ],
        max_tokens=LLM_MAX_TOKENS,
        temperature=LLM_TEMPERATURE,
        stop=["\n\n\n"],
    )

    suggestion = resp.choices[0].message.content or ""
    return suggestion.strip()
