"""LLM streaming client with OpenAI-compatible and local CLI providers."""

from __future__ import annotations

import logging
import os
import shutil
import subprocess
import tempfile
import time
from collections.abc import Generator
from pathlib import Path

from openai import OpenAI

from configs.llm import (
    CLAUDE_BIN,
    CLAUDE_MODEL,
    CODEX_BIN,
    CODEX_HOME,
    CODEX_MODEL,
    CODEX_REASONING_EFFORT,
    CODEX_REASONING_SUMMARY,
    CODEX_SANDBOX,
    CODEX_VERBOSITY,
    CODEX_WORKDIR,
    LLM_BASE_URL,
    LLM_CLI_CHUNK_SIZE,
    LLM_CLI_TIMEOUT_SECONDS,
    LLM_EXTRA_HEADERS,
    LLM_FALLBACK_PROVIDER,
    LLM_MAX_TOKENS,
    LLM_MODEL,
    LLM_PROVIDER,
    get_api_key,
    key_count,
    rotate_api_key,
)

logger = logging.getLogger(__name__)

OPENAI_PROVIDERS = {"auto", "openai", "openai-compatible", "openrouter", "deepseek", "azure", "ollama"}
CLI_PROVIDERS = {"codex", "claude"}


def _is_rate_limit(exc: Exception) -> bool:
    """Return True if the exception is an HTTP 429 (rate limit)."""
    if hasattr(exc, "status_code"):
        return getattr(exc, "status_code") == 429
    if hasattr(exc, "response"):
        resp = getattr(exc, "response", None)
        if resp is not None and getattr(resp, "status_code", None) == 429:
            return True
    return "429" in str(exc) or "rate" in str(exc).lower()


def create_client(key: str = "") -> OpenAI:
    """Create an OpenAI-compatible client. Uses the current rotation key if none given."""
    return OpenAI(
        api_key=key or get_api_key(),
        base_url=LLM_BASE_URL,
        default_headers=LLM_EXTRA_HEADERS or None,
    )


def stream_chat_completion(
    messages: list[dict[str, str]],
    temperature: float,
    max_tokens: int = LLM_MAX_TOKENS,
    model: str = "",
) -> Generator[str, None, None]:
    """Yield text deltas from the configured LLM provider."""
    provider = _select_provider()
    resolved_model = model or LLM_MODEL
    logger.info("Using LLM provider: %s, model: %s", provider, resolved_model)

    if provider == "openai":
        yield from _stream_openai(messages, temperature, max_tokens, resolved_model)
        return

    yield from _stream_cli(provider, messages)


def _select_provider() -> str:
    provider = LLM_PROVIDER or "auto"

    if provider in OPENAI_PROVIDERS and get_api_key():
        return "openai"
    if provider in CLI_PROVIDERS:
        return provider

    fallback = LLM_FALLBACK_PROVIDER or "auto"
    if fallback in CLI_PROVIDERS and _cli_available(fallback):
        return fallback

    for candidate in ("codex", "claude"):
        if _cli_available(candidate):
            return candidate

    if provider in OPENAI_PROVIDERS:
        raise RuntimeError(
            "No LLM_API_KEY is configured and no local Codex/Claude CLI is available."
        )

    raise RuntimeError(f"Unsupported LLM_PROVIDER: {provider}")


def _stream_openai(
    messages: list[dict[str, str]],
    temperature: float,
    max_tokens: int,
    model: str,
) -> Generator[str, None, None]:
    total_keys = max(key_count(), 1)
    for attempt in range(total_keys):
        client = create_client()
        try:
            stream = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                stream=True,
            )
            for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta
                if delta.content:
                    yield delta.content
            return  # success
        except Exception as e:
            if _is_rate_limit(e) and rotate_api_key():
                logger.warning(
                    "Rate limited (attempt %d/%d), rotating API key...",
                    attempt + 1, total_keys,
                )
                continue
            raise


def _stream_cli(provider: str, messages: list[dict[str, str]]) -> Generator[str, None, None]:
    prompt = _messages_to_prompt(messages)
    if provider == "codex":
        text = _run_codex(prompt)
    elif provider == "claude":
        text = _run_claude(prompt)
    else:
        raise RuntimeError(f"Unsupported CLI LLM provider: {provider}")

    yield from _chunk_text(text)


def _run_codex(prompt: str) -> str:
    executable = _resolve_executable(CODEX_BIN)
    if not executable:
        raise RuntimeError("Codex CLI is not available. Set CODEX_BIN or install codex.")

    workdir = Path(CODEX_WORKDIR or "/tmp")
    workdir.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(prefix="codex-answer-", suffix=".txt", delete=False) as output:
        output_path = Path(output.name)

    cmd = [
        executable,
        "exec",
        "-c",
        f"model_reasoning_effort={_toml_string(CODEX_REASONING_EFFORT or 'low')}",
        "-c",
        f"model_reasoning_summary={_toml_string(CODEX_REASONING_SUMMARY or 'none')}",
        "-c",
        f"model_verbosity={_toml_string(CODEX_VERBOSITY or 'low')}",
        "--skip-git-repo-check",
        "--sandbox",
        CODEX_SANDBOX or "read-only",
        "--ephemeral",
        "--output-last-message",
        str(output_path),
    ]
    if CODEX_MODEL:
        cmd.extend(["--model", CODEX_MODEL])
    cmd.append("-")

    env = os.environ.copy()
    if CODEX_HOME:
        env["CODEX_HOME"] = CODEX_HOME

    try:
        started_at = time.monotonic()
        logger.info("Starting Codex CLI fallback: workdir=%s timeout=%ss", workdir, LLM_CLI_TIMEOUT_SECONDS)
        completed = subprocess.run(
            cmd,
            input=prompt,
            text=True,
            capture_output=True,
            timeout=LLM_CLI_TIMEOUT_SECONDS,
            cwd=str(workdir),
            env=env,
            check=False,
        )
        elapsed = time.monotonic() - started_at
        answer = output_path.read_text(encoding="utf-8").strip()
        if completed.returncode != 0:
            stderr = completed.stderr.strip() or completed.stdout.strip()
            raise RuntimeError(f"Codex CLI failed: {stderr[-800:]}")
        if not answer:
            answer = completed.stdout.strip()
        if not answer:
            raise RuntimeError("Codex CLI returned an empty response.")
        logger.info("Codex CLI fallback finished in %.1fs", elapsed)
        return answer
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(f"Codex CLI timed out after {LLM_CLI_TIMEOUT_SECONDS}s.") from exc
    finally:
        output_path.unlink(missing_ok=True)


def _run_claude(prompt: str) -> str:
    executable = _resolve_executable(CLAUDE_BIN)
    if not executable:
        raise RuntimeError("Claude CLI is not available. Set CLAUDE_BIN or install claude.")

    cmd = [executable]
    if CLAUDE_MODEL:
        cmd.extend(["--model", CLAUDE_MODEL])
    cmd.extend(["-p", prompt])

    try:
        completed = subprocess.run(
            cmd,
            text=True,
            capture_output=True,
            timeout=LLM_CLI_TIMEOUT_SECONDS,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError(f"Claude CLI timed out after {LLM_CLI_TIMEOUT_SECONDS}s.") from exc

    if completed.returncode != 0:
        stderr = completed.stderr.strip() or completed.stdout.strip()
        raise RuntimeError(f"Claude CLI failed: {stderr[-800:]}")
    answer = completed.stdout.strip()
    if not answer:
        raise RuntimeError("Claude CLI returned an empty response.")
    return answer


def _messages_to_prompt(messages: list[dict[str, str]]) -> str:
    parts = [
        "You are serving as the AI chat backend for QeEdu.",
        "Answer the final user message using the full conversation.",
        "Keep the user's language unless they ask otherwise.",
        "",
        "Conversation:",
    ]
    for message in messages:
        role = message.get("role", "user").strip() or "user"
        content = message.get("content", "").strip()
        if not content:
            continue
        parts.append(f"\n[{role}]\n{content}")
    parts.append("\nReturn only the assistant answer.")
    return "\n".join(parts)


def _chunk_text(text: str) -> Generator[str, None, None]:
    if not text:
        return
    size = max(16, LLM_CLI_CHUNK_SIZE)
    for start in range(0, len(text), size):
        yield text[start : start + size]


def _cli_available(provider: str) -> bool:
    if provider == "codex":
        return _resolve_executable(CODEX_BIN) is not None
    if provider == "claude":
        return _resolve_executable(CLAUDE_BIN) is not None
    return False


def _resolve_executable(command: str) -> str | None:
    if not command:
        return None
    if os.path.isabs(command) or os.sep in command:
        path = Path(command)
        return str(path) if path.exists() and os.access(path, os.X_OK) else None
    return shutil.which(command)


def _toml_string(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'
