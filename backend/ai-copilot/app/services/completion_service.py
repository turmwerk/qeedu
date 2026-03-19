"""Completion service — code completion via LLM."""

import logging

from app.llm.client import create_client
from app.llm.prompt import COMPLETION_SYSTEM, build_completion_prompt
from configs.llm import LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS

logger = logging.getLogger(__name__)


def complete(
    language: str,
    file_content: str,
    cursor_offset: int,
    file_path: str = "",
) -> str:
    """Return a code completion suggestion.

    Args:
        language: Programming language.
        file_content: Full file content.
        cursor_offset: Byte offset of the cursor.
        file_path: Path hint (unused by prompt but logged).

    Returns:
        The suggested completion text, or empty string on failure.
    """
    client = create_client()
    prompt = build_completion_prompt(language, file_content, cursor_offset)

    resp = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": COMPLETION_SYSTEM},
            {"role": "user", "content": prompt},
        ],
        max_tokens=LLM_MAX_TOKENS,
        temperature=LLM_TEMPERATURE,
        stop=["\n\n\n"],
    )

    suggestion = resp.choices[0].message.content or ""
    return suggestion.strip()
