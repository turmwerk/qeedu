"""AI Chat gRPC service entry point."""

import logging
import os
import signal
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

_local_config = Path(__file__).resolve().parent.parent.parent / "configs" / "llm.json"
if _local_config.exists() and not os.getenv("LLM_CONFIG_PATH"):
    os.environ["LLM_CONFIG_PATH"] = str(_local_config)

from configs.env import GRPC_PORT, LOG_LEVEL

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="[ai-chat] %(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)


def serve():
    from app.rpc.server import create_server

    server = create_server(GRPC_PORT)
    server.start()
    logger.info("AI-Chat service listening on :%d", GRPC_PORT)

    def _shutdown(signum, frame):
        logger.info("Shutting down...")
        server.stop(grace=5)
        sys.exit(0)

    signal.signal(signal.SIGTERM, _shutdown)
    signal.signal(signal.SIGINT, _shutdown)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
