#!/bin/sh
set -eu

/sandbox-runtime/build-runtime-images.sh
exec /sandbox
