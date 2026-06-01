"""gRPC service implementation for AI Chat."""

import grpc
import logging
from concurrent import futures
from app.rpc import ai_chat_pb2, ai_chat_pb2_grpc
from app.services.chat_service import chat_stream
from app.services.fixbug_service import fixbug_stream
from configs.env import GRPC_MAX_WORKERS

logger = logging.getLogger(__name__)


def _read_metadata(context) -> tuple[str, str, str]:
    """Read x-model, x-api-key, x-base-url from gRPC request metadata."""
    model = ""
    api_key = ""
    base_url = ""
    for key, value in context.invocation_metadata():
        if key == "x-model":
            model = value
        elif key == "x-api-key":
            api_key = value
        elif key == "x-base-url":
            base_url = value
    return model, api_key, base_url


class AIChatServicer(ai_chat_pb2_grpc.AIChatServiceServicer):
    def Chat(self, request, context):
        try:
            model, api_key, base_url = _read_metadata(context)
            messages = [{"role": m.role, "content": m.content} for m in request.messages]
            for delta in chat_stream(
                messages,
                request.file_context,
                request.language,
                model=model,
                api_key=api_key,
                base_url=base_url,
                temperature=request.temperature if request.temperature > 0 else None,
                max_tokens=request.max_tokens if request.max_tokens > 0 else None,
            ):
                yield ai_chat_pb2.ChatResponse(delta=delta, done=False)
            yield ai_chat_pb2.ChatResponse(delta="", done=True)
        except Exception as e:
            logger.exception("Chat error")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return

    def FixBug(self, request, context):
        try:
            model, api_key, base_url = _read_metadata(context)
            for delta in fixbug_stream(
                request.code,
                request.error_message,
                request.language,
                model=model,
                api_key=api_key,
                base_url=base_url,
                temperature=request.temperature if request.temperature > 0 else None,
                max_tokens=request.max_tokens if request.max_tokens > 0 else None,
            ):
                yield ai_chat_pb2.FixBugResponse(delta=delta, done=False)
            yield ai_chat_pb2.FixBugResponse(delta="", done=True)
        except Exception as e:
            logger.exception("FixBug error")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return


def create_server(port: int) -> grpc.Server:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=GRPC_MAX_WORKERS))
    ai_chat_pb2_grpc.add_AIChatServiceServicer_to_server(AIChatServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    return server
