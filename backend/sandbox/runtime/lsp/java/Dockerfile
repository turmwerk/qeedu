FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-21-jdk python3 curl ca-certificates tar gzip \
    && mkdir -p /opt/jdtls \
    && curl -fsSL https://download.eclipse.org/jdtls/snapshots/jdt-language-server-latest.tar.gz \
        | tar --no-same-owner -xz -C /opt/jdtls \
    && ln -sf /opt/jdtls/bin/jdtls /usr/local/bin/jdtls \
    && chmod +x /opt/jdtls/bin/jdtls \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
