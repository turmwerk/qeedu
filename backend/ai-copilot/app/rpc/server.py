"""gRPC service implementation for AI Copilot."""

import grpc
import logging
from concurrent import futures
from app.rpc import ai_copilot_pb2, ai_copilot_pb2_grpc
from app.services.completion_service import complete
from configs.env import GRPC_MAX_WORKERS

logger = logging.getLogger(__name__)


class AICopilotServicer(ai_copilot_pb2_grpc.AICopilotServiceServicer):
    def Complete(self, request, context):
        try:
            suggestion = complete(
                language=request.language,
                file_content=request.file_content,
                cursor_offset=request.cursor_offset,
                file_path=request.file_path,
            )
            return ai_copilot_pb2.CompleteResponse(suggestion=suggestion)
        except Exception as e:
            logger.error("Complete error: %s", e)
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return ai_copilot_pb2.CompleteResponse(suggestion="")


def create_server(port: int) -> grpc.Server:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=GRPC_MAX_WORKERS))
    ai_copilot_pb2_grpc.add_AICopilotServiceServicer_to_server(AICopilotServicer(), server)
    server.add_insecure_port(f"[::]:{port}")
    return server
