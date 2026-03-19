"""LLM client factory — creates an OpenAI-compatible client from configs."""

from openai import OpenAI
from configs.llm import LLM_API_KEY, LLM_BASE_URL


def create_client() -> OpenAI:
    return OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)
