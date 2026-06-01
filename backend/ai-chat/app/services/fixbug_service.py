"""FixBug service — streaming bug analysis and fix with LLM."""

import logging
from typing import Generator

from app.llm.client import stream_chat_completion
from app.llm.prompt import FIXBUG_SYSTEM
from configs.llm import FIXBUG_MODEL, FIXBUG_MAX_TOKENS, FIXBUG_TEMPERATURE

logger = logging.getLogger(__name__)


def fixbug_stream(
    code: str,
    error_message: str,
    language: str,
    model: str = "",
    api_key: str = "",
    base_url: str = "",
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> Generator[str, None, None]:
    resolved_model = model or FIXBUG_MODEL
    user_msg = (
        f"Language: {language}\n\n"
        f"Code:\n```\n{code}\n```\n\n"
        f"Error:\n```\n{error_message}\n```"
    )

    logger.info("FixBug stream requested: model=%s, language=%s", resolved_model, language)

    yield from stream_chat_completion(
        [
            {"role": "system", "content": FIXBUG_SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        temperature=temperature if temperature is not None else FIXBUG_TEMPERATURE,
        max_tokens=max_tokens if max_tokens is not None and max_tokens > 0 else FIXBUG_MAX_TOKENS,
        model=resolved_model,
        api_key=api_key,
        base_url=base_url,
    )
