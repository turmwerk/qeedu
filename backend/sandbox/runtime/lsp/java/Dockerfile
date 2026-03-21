FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-17-jdk jdtls ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
