"""Chat service — streaming conversation with LLM."""

import logging
from typing import Generator

from app.llm.client import create_client
from app.llm.prompt import CHAT_SYSTEM
from configs.llm import LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS

logger = logging.getLogger(__name__)


def chat_stream(
    messages: list[dict[str, str]],
    file_context: str = "",
    language: str = "",
) -> Generator[str, None, None]:
    """Yield streaming deltas for a chat conversation.

    Args:
        messages: Conversation history [{"role": ..., "content": ...}].
        file_context: Optional current file content for context.
        language: Programming language of the file context.

    Yields:
        Text delta strings.
    """
    client = create_client()

    llm_messages: list[dict[str, str]] = [{"role": "system", "content": CHAT_SYSTEM}]

    if file_context:
        ctx = f"Current file ({language or 'unknown'}):\n```\n{file_context[:3000]}\n```"
        llm_messages.append({"role": "system", "content": ctx})

    llm_messages.extend(messages)

    stream = client.chat.completions.create(
        model=LLM_MODEL,
        messages=llm_messages,
        max_tokens=LLM_MAX_TOKENS,
        temperature=LLM_TEMPERATURE,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta
        if delta.content:
            yield delta.content
