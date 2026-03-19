"""General service configuration."""

import os

# ── gRPC server ─────────────────────────────────────
GRPC_PORT: int = int(os.getenv("GRPC_PORT", "50053"))
GRPC_MAX_WORKERS: int = int(os.getenv("GRPC_MAX_WORKERS", "10"))

# ── Logging ─────────────────────────────────────────
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
