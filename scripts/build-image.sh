#!/usr/bin/env bash
# Build, tag, and (optionally) push the underwrite runtime image.
#
# Usage:
#   ./scripts/build-image.sh                # build underwrite:dev
#   ./scripts/build-image.sh v0.9.0         # build underwrite:v0.9.0
#   ./scripts/build-image.sh v0.9.0 --push  # tag and push
#
# Requires: docker, git (for the build args).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

VERSION="${1:-dev}"
PUSH="false"
if [[ "${2:-}" == "--push" ]]; then
  PUSH="true"
fi

GIT_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo dev)"
BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# docker buildx with --load is the default in CI; locally use plain
# docker build. Use --provenance=false to keep the image small and
# SBOM-free for the runtime layer.
echo ">> building underwrite:${VERSION} (commit=${GIT_COMMIT}, date=${BUILD_DATE})"
docker build \
    --build-arg "BUILD_VERSION=${VERSION}" \
    --build-arg "GIT_COMMIT=${GIT_COMMIT}" \
    --build-arg "BUILD_DATE=${BUILD_DATE}" \
    --tag "underwrite:${VERSION}" \
    --tag "underwrite:latest" \
    --label "org.opencontainers.image.revision=${GIT_COMMIT}" \
    --label "org.opencontainers.image.created=${BUILD_DATE}" \
    --label "org.opencontainers.image.version=${VERSION}" \
    --provenance=false \
    --sbom=false \
    --progress=plain \
    -f Dockerfile \
    .

if [[ "${PUSH}" == "true" ]]; then
    echo ">> pushing underwrite:${VERSION}"
    docker push "underwrite:${VERSION}"
    docker push "underwrite:latest"
fi

echo ">> image built: underwrite:${VERSION} (and underwrite:latest)"
docker images "underwrite:${VERSION}" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
