# Roadmap

Based on `TODO.md` (production readiness score: 57/100) and codebase analysis.

---

## v0.9 — hardening + real KYC integrations (landed)

The v0.9 release line replaces the protocol-stub KYC providers
with full wire-protocol clients (Karza-style / UIDAI KUA / CIBIL
partner / CERSAI), the production Dockerfile ships a multi-stage
build with non-root user and healthcheck, and the docs / changelog
reflect the hardened state. See `CHANGELOG.md` for the full
list of fixes.

- Real PAN verification client (`services/kyc_providers/pan.py`)
- Real Aadhaar eKYC client (`services/kyc_providers/aadhaar.py`)
- Real CIBIL consumer bureau pull (`services/kyc_providers/cibil.py`)
- Real CKYC registry search (`services/kyc_providers/ckyc.py`)
- Common `KycProvider` ABC + `Verdict` enum + `ProviderResult`
  envelope (`services/kyc_providers/base.py`)
- Runtime auto-wires the configured providers into the
  compliance and credit-bureau services
- Production Dockerfile (`Dockerfile`) — multi-stage, non-root,
  healthcheck, OCI labels, build args
- Docker image CI workflow (`.github/workflows/docker.yml`)
- `scripts/build-image.sh` — local build helper

---

## Short-term — v1.0 — production hardening (4 weeks)

| Priority | Item | Est. |
|----------|------|------|
| Critical | Run the v0.9 image against a real KYC sandbox end-to-end | 1w |
| Critical | Pin partner sandbox URLs and capture operator documentation | 2d |
| Critical | Wire Razorpay e-NACH / UPI Autopay mandate collection | 3d |
| High | Add provider sandbox tests in CI (mock the partner sandbox) | 2d |
| High | Helm chart for the runtime + Postgres + Vault + OTLP | 3d |
| High | Pre-built multi-arch (amd64 + arm64) images | 2d |
| High | Playbook for on-call (incident response, key rotation, DLQ replay) | 1d |
| Medium | Read-only `underwrite` role for `psql`/Vault operations | 1d |
| Medium | OpenAPI 3.1 spec generated from the FastAPI surface | 2d |
| Low | Helm chart integration tests (kind cluster in CI) | 3d |

## Medium-term — v0.3.0 (~2 weeks)

| Priority | Item | Est. |
|----------|------|------|
| High | Saga persistence via Store backend (in-memory only today) | 3-4h |
| High | Prometheus `/metrics` endpoint at standard path | 2h |
| High | Async event bus (`asyncio`) implementation | 4-6h |
| High | RBI monthly/quarterly reporting auto-generation | 2d |
| Medium | Configuration validation at Runtime startup (not just load) | 1h |
| Medium | Delegation chain depth limit in `__required_delegation` (MD3) | 30m |
| Medium | `FileStore.keys()` pagination (MD2) | 1h |
| Medium | Indian language document generation (Hindi, Marathi, Tamil) | 2d |
| Low | `tox.ini` for local matrix testing | 30m |

## Long-term — v0.4.0 ~ v0.5.0 (~4 weeks)

| Priority | Feature | Est. |
|----------|---------|------|
| High | FastAPI OTLP auto-instrumentation (`opentelemetry-instrumentation-fastapi`) | 2h |
| High | RBI audit trail export (XBRL format for regulatory filings) | 2d |
| Medium | Config-driven fee schedules (replace `FEE_SCHEDULES` module-level dict) | 2h |
| Medium | Plugin-based model loading (strategy pattern for risk models) | 3h |
| Medium | Distributed rate limiting (`DistributedRateLimiter` with Store backend) | 2h |
| Medium | DLQ persistence + replay automation (CLI command) | 2h |
| Medium | PyPI publishing CI (GitHub Actions release workflow) | 1h |
| Medium | MeitY-empanelled cloud provider deployment guide | 1d |
| Low | Structured audit export to S3/GCS | 4h |
| Low | JSON Schema enforcement at runtime | 2h |

## Production Readiness — v1.0.0

Target: **80+ production readiness score** (currently 57/100).

| Category | Target | Current |
|----------|--------|---------|
| Architecture | 85+ | 75 |
| Security | 80+ | 45 |
| Testing | 80+ | 70 |
| Performance | 70+ | 40 |
| Observability | 80+ | 35 |
| Packaging | 80+ | 60 |
| Documentation | 70+ | 40 |
| DevOps | 70+ | 30 |
| Developer Experience | 70+ | 50 |

### Must-have for v1.0.0
- Fix all critical security issues (token exposure, path traversal, SQL injection)
- Prometheus `/metrics` at standard path (`GET /metrics`, not `/v1/metrics`)
- Structured logging with correlation IDs
- Async event bus
- Saga persistence (not in-memory)
- Distributed event bus support (SQS/Modal) — at least one production backend
- Pre-commit hooks configured
- `docker-compose.yml` for local Postgres + Vault + OTLP
- 80%+ test coverage with concurrency stress tests

### Nice-to-have for v1.0.0
- Config-driven fee schedules
- Plugin-based model loading
- Structured audit export to object storage
- PyPI publishing CI
