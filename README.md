# underwrite — Indian Lending Platform (Beta)

[![CI](https://github.com/sachncs/underwrite/actions/workflows/ci.yml/badge.svg)](https://github.com/sachncs/underwrite/actions/workflows/ci.yml)
[![Python 3.10+](https://img.shields.io/badge/python-3.10%20|%203.11%20|%203.12%20|%203.13-blue)](https://pypi.org/project/underwrite/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)

> **Beta — not yet production-ready.** See [caveats](#status) below.

A **nano-service platform** for Indian retail lending. Designed for RBI Digital Lending Guidelines compliance, with DPDPA 2023 data protection, 30+ independently deployable services connected by an event bus with Ed25519 cryptographic attestation.

- **31 nano-services** — KYC/AML (PAN + Aadhaar Verhoeff), CIBIL/Experian/Equifax credit bureau, CKYC registry, RBI rate-capped pricing, KFS generation, DPDPA consent + DSR, Razorpay PG, risk scoring, fraud detection, collections, recovery, notifications, governance
- **Event-driven** — typed events with Ed25519 signatures, saga orchestration, dead-letter queues, circuit breakers
- **Pluggable backends** — memory / filesystem / Postgres; local / SQS / Modal event bus; console / OTLP tracing
- **1167 tests** — rate limiting, idempotency guards, PII redaction, Prometheus metrics

---

## Status

This is an **early-stage beta**. It is not production-ready. Known gaps:

- Real API integrations for PAN (NSDL/ITD), Aadhaar (UIDAI), CKYC, CIBIL, and AML blocklists are **stubbed** — format validation only
- Video KYC provider integration is **not yet implemented**
- e-NACH / UPI Autopay mandate collection is **stubbed** (event definitions exist, Razorpay integration skeleton present)
- No RBAC beyond basic access control
- No disaster recovery procedures documented
- Developer experience is rough — no pre-built Docker images, no Helm charts, manual service wiring required

If you need a production-grade Indian lending platform today, underwrite is not the right choice.

---

## Quick Start

```bash
git clone https://github.com/sachncs/underwrite.git
cd underwrite
./setup.sh
source .venv/bin/activate
python -m pytest tests/ --tb=short -q   # 1167 tests
```

To run an Indian lending scenario:

```bash
underwrite init
# edit underwrite.json to enable: mechanism,audit,risk,fraud,compliance,consent,credit_bureau,kfs,pricing,underwriter,decision
underwrite run mechanism audit risk fraud compliance consent credit_bureau kfs pricing underwriter decision
# In another terminal:
python docs/examples/indian_lending.py
# See docs/QUICKSTART.md for the full walkthrough
```

---

## Documentation

Full docs at [`docs/`](docs/README.md) — but expect rough edges:

| Area | Documents |
|------|-----------|
| **Getting Started** | [Installation](docs/INSTALLATION.md) · [Quickstart](docs/QUICKSTART.md) (Indian scenario) · [Configuration](docs/CONFIGURATION.md) · [Env Vars](docs/ENVIRONMENT_VARIABLES.md) |
| **Architecture** | [Overview](docs/architecture.md) · [System Design](docs/SYSTEM_DESIGN.md) · [Domain Model](docs/DOMAIN_MODEL.md) · [Design Decisions](docs/DESIGN_DECISIONS.md) |
| **Development** | [Guide](docs/DEVELOPMENT.md) · [Testing](docs/TESTING.md) · [Debugging](docs/DEBUGGING.md) · [Code Style](docs/CODE_STYLE.md) · [Build](docs/BUILD.md) |
| **Operations** | [Deployment](docs/DEPLOYMENT.md) · [Operations](docs/OPERATIONS.md) · [Observability](docs/OBSERVABILITY.md) · [Security](docs/SECURITY.md) (DPDPA) · [Performance](docs/PERFORMANCE.md) |
| **Reference** | [API](docs/API.md) · [Troubleshooting](docs/TROUBLESHOOTING.md) · [FAQ](docs/FAQ.md) · [Glossary](docs/GLOSSARY.md) |
| **Project** | [Contributing](docs/CONTRIBUTING.md) · [Maintenance](docs/MAINTENANCE.md) · [Roadmap](docs/ROADMAP.md) |

---

## Prerequisites

- **Python 3.10+**
- **PostgreSQL 14+** (optional — memory/filesystem backends work without it)
- **Docker** (optional — for `docker compose up` with Postgres + Vault + OTLP)

---

## Installation

```bash
pip install underwrite
# With extras:
pip install "underwrite[risk,serve,postgres,otlp,vault,aws]"
# Development:
pip install -e ".[dev,risk,serve,postgres,otlp,vault,aws]"
```

| Extra | Provides |
|-------|----------|
| `risk` | NumPy, scikit-learn — ML risk models |
| `serve` | Uvicorn, FastAPI — HTTP server |
| `postgres` | psycopg2-binary — Postgres state store |
| `otlp` | OpenTelemetry SDK — distributed tracing |
| `vault` | hvac — HashiCorp Vault secrets |
| `aws` | boto3 — SES, SQS, Secrets Manager |
| `security` | bandit, pip-audit — vulnerability scanning |
| `dev` | pytest, ruff, mypy, hypothesis, testcontainers |

---

## Configuration

Configure via **JSON file** (created with `underwrite init`), **env vars**, or both (env vars override). See [`.env.example`](.env.example) for all supported vars, including RBI pricing caps, AML thresholds, credit bureau API keys, Razorpay credentials, and DPDPA retention periods.

```bash
UNDERWRITE_STORE_BACKEND=postgres
UNDERWRITE_STORE_DSN=postgresql://user:pass@localhost:5432/underwrite
UNDERWRITE_PERSONAL_LOAN_RATE_CAP=0.28
UNDERWRITE_PENAL_INTEREST_CAP=0.24
```

---

## CLI

```
underwrite

Commands:
  init [PATH]              Create default config
  run <service>...         Start one or more services
  list                     List all 31 nano-services
  identity <service>       Generate Ed25519 keypair
  health                   System health status
  dlq [--replay] [--max N] Show or replay dead-letter queue
  metrics                  Metrics snapshot (Prometheus-format on /v1/metrics)
  migrate                  Run pending schema migrations
  serve                    Start HTTP daemon (requires [serve] extra)
```

---

## HTTP API

When running `underwrite serve`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/healthz` | GET | Liveness probe |
| `/readyz` | GET | Readiness probe |
| `/v1/health` | GET | Full system health |
| `/v1/metrics` | GET | Prometheus-format metrics |
| `/v1/publish` | POST | Publish a domain event |

Authentication via `Authorization: Bearer <token>` when started with `--require-auth`.

---

## Project Structure

```
underwrite/                    # Source (90+ modules, fully typed)
  __config__.py                # Pydantic configuration (28 sections)
  __bus__.py                   # Event bus — pub/sub, DLQ, rate limiter
  __store__.py                 # State store — memory / file / postgres
  __saga__.py                  # Saga orchestrator
  __authz__.py                 # Access control & Ed25519 verification
  __identity__.py              # Ed25519 key management
  __events__.py                # 105+ event types
  __pii.py                     # PII redaction (Aadhaar, PAN, etc.)
  services/                    # 31 nano-services
    base.py                    # NanoService ABC
    mechanism/                 # Delegation state machine (core)
    compliance/                # KYC/AML — PAN category, Aadhaar Verhoeff, risk score
    pricing/                   # RBI caps, APR, EMI, penal interest, foreclosure
    kfs/                       # Key Fact Statement generation
    consent/                   # DPDPA consent lifecycle
    dsr/                       # Data Subject Rights fulfillment
    credit_bureau/             # CIBIL/Experian/Equifax + CKYC
    razorpay/                  # Payment gateway integration
    risk/                      # ML risk scoring
    fraud/                     # Fraud detection
    audit/                     # Event ledger (PII-redacted)
    npa/                       # Asset classification (SMA/NPA/DLG)
    recovery/                  # Default recovery (store-backed)
    ...                        # 17 more services
tests/                         # 58 test files, 1167 tests
docs/                          # 9 updated docs for Indian market
```

---

## Architecture

Each nano-service extends `NanoService` with a single `handle(event: Event) -> None`:

1. **Subscribe** — declare interest in event types via config
2. **Dispatch** — handler wrapped with authz, idempotency, tracing, metrics, timeout
3. **Emit** — `self.emit(event)` signs with Ed25519 and publishes to bus
4. **Persist** — state via `Store` (MemoryStore / FileStore / PostgresStore)

Cross-cutting concerns (authz, tracing, metrics, sagas, supervisor, circuit breaker) are injected by the bus and runtime — not inherited by services.

### Design Decisions

| Principle | Implementation |
|-----------|----------------|
| **Event provenance** | Ed25519 signature on every event, verified before dispatch |
| **Fault isolation** | DLQ with replay; per-subscriber circuit breaker; per-handler timeout |
| **Security-first** | No `str(default)` in signing; joblib gated by env var; bearer auth; PII redaction |
| **RBI compliance** | Per-product rate caps, all-in-cost APR, penal interest limit, KFS cooling-off |
| **DPDPA compliance** | Consent lifecycle, DSR fulfillment, breach notification, auto-purge |

---

## License

MIT — see [LICENSE](LICENSE). Not legal advice. Consult a qualified attorney before deploying in a regulated environment.
