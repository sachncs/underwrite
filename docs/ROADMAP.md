# Roadmap

Based on `TODO.md` (production readiness score: 57/100) and codebase analysis.

---

## Short-term — v0.2.0 — Indian Regulatory Compliance (2 weeks)

| Priority | Item | Est. |
|----------|------|------|
| Critical | Real PAN verification API integration (NSDL/ITD) | 2d |
| Critical | Real Aadhaar verification API integration (UIDAI) | 2d |
| Critical | Real CIBIL credit report API integration | 2d |
| High | Real-time AML screening integration (OFSAC/UNSC/domestic blocklist) | 2d |
| High | KFS template generation (Hindi + English per RBI DLG) | 2d |
| High | E-mandate / e-NACH integration with Razorpay | 2d |
| High | Video KYC provider integration (e.g., Digilocker, NSDL) | 3d |
| Medium | Grievance portal webhook integration | 1d |
| Medium | Breach notification template (DPDPA Section 8) | 1d |
| Medium | Data retention batch auto-purge job | 2d |

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
