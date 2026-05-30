"""Chat service — streaming conversation with LLM."""

import logging
from typing import Generator

from app.llm.client import stream_chat_completion
from app.llm.prompt import CHAT_SYSTEM
from configs.llm import LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS

logger = logging.getLogger(__name__)


def chat_stream(
    messages: list[dict[str, str]],
    file_context: str = "",
    language: str = "",
) -> Generator[str, None, None]:
    llm_messages: list[dict[str, str]] = [{"role": "system", "content": CHAT_SYSTEM}]

    if file_context:
        ctx = f"Current file ({language or 'unknown'}):\n```\n{file_context[:3000]}\n```"
        llm_messages.append({"role": "system", "content": ctx})

    llm_messages.extend(messages)

    logger.info(
        "Chat stream requested: model=%s, messages=%d, has_file_context=%s",
        LLM_MODEL,
        len(messages),
        bool(file_context),
    )

    yield from stream_chat_completion(
        llm_messages,
        temperature=LLM_TEMPERATURE,
        max_tokens=LLM_MAX_TOKENS,
    )
