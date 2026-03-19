"""FixBug service — streaming bug analysis and fix with LLM."""

import logging
from typing import Generator

from app.llm.client import create_client
from app.llm.prompt import FIXBUG_SYSTEM
from configs.llm import LLM_MODEL, LLM_MAX_TOKENS

logger = logging.getLogger(__name__)


def fixbug_stream(
    code: str,
    error_message: str,
    language: str,
) -> Generator[str, None, None]:
    """Yield streaming deltas for a bug-fix analysis.

    Args:
        code: The buggy source code.
        error_message: The error output / traceback.
        language: Programming language.

    Yields:
        Text delta strings.
    """
    client = create_client()

    user_msg = (
        f"Language: {language}\n\n"
        f"Code:\n```\n{code}\n```\n\n"
        f"Error:\n```\n{error_message}\n```"
    )

    stream = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": FIXBUG_SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        max_tokens=LLM_MAX_TOKENS,
        temperature=0.3,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta
        if delta.content:
            yield delta.content
