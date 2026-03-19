"""Prompt templates for code completion."""

COMPLETION_SYSTEM = """You are a code completion engine. Given the code context, predict what the developer wants to type next. Return ONLY the code that should be inserted at the cursor position, nothing else. Do not include explanations, markdown formatting, or code fences. If you are unsure, return an empty string."""

def build_completion_prompt(language: str, file_content: str, cursor_offset: int) -> str:
    """Build a completion prompt with prefix/suffix context."""
    prefix = file_content[:cursor_offset]
    suffix = file_content[cursor_offset:]

    # Limit context window
    max_prefix = 2000
    max_suffix = 500
    if len(prefix) > max_prefix:
        prefix = prefix[-max_prefix:]
    if len(suffix) > max_suffix:
        suffix = suffix[:max_suffix]

    return (
        f"Language: {language}\n"
        f"Code before cursor:\n```\n{prefix}\n```\n"
        f"Code after cursor:\n```\n{suffix}\n```\n"
        f"Complete the code at the cursor position:"
    )
