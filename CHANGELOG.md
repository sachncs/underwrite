# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

> **WARNING**: This is a beta project. Not production-ready. Not developer-friendly.
> Known gaps: no real PAN/Aadhaar/CIBIL API integrations (format validation only),
> no video KYC, no e-NACH, incomplete RBAC, no DR procedures, rough DX.

## [Unreleased]

### Added
- `LocalBus.is_stopped()` and `LocalBus.subscriber_count()` public accessors;
  runtime bus health probe now reports the real subscriber count and
  stopped-state instead of always returning `ok: True`.
- SQS distributed event bus backend (`__bus_sqs__.py`, 172 lines)
- Modal distributed event bus backend (`__bus_modal__.py`, 141 lines)
- DPDPA 2023 compliance config: `ConsentConfig`, `DsrConfig`, `DpdpaConfig` with consent validity, DSR response SLA, breach notification timer, data retention periods
- `NpaConfig` with SMA-0/1/2 thresholds, provisioning rates per RBI IRAC norms
- `UnderwritingConfig` with credit score floor, DTI cap, LTV cap, min/max principal, tenor
- `CreditBureauConfig` for CIBIL/Experian/Equifax + CKYC API keys and endpoints
- `KfsConfig` for Key Fact Statement cooling-off period per RBI DLG
- `RazorpayConfig` for payment gateway integration (UPI Autopay, e-NACH)
- Missing SERVICE_NAMES entries: `consent`, `dsr`, `credit_bureau`, `kfs`
- WIRING entries for `aml.flagged`, `kyc.video_initiated`, `kyc.video_verified`, `pricing.penal_interest`, `pricing.foreclosure`, `recovery.offer`, `recovery.escalated`, `recovery.progress`
- AML blocklist path (`AML_BLOCKLIST_PATH`) env var support
- Per-product RBI pricing cap env vars (`UNDERWRITE_PERSONAL_LOAN_RATE_CAP`, `UNDERWRITE_MICRO_LOAN_RATE_CAP`, `UNDERWRITE_PENAL_INTEREST_CAP`, `UNDERWRITE_COOLING_OFF_DAYS`)
- Credit bureau / CKYC / Razorpay / DPDPA env vars
- AML env vars (`AML_BLOCKLIST_PATH`, `AML_THRESHOLD_LOW`, `AML_THRESHOLD_FROZEN`)
- `UNDERWRITE_SQS_QUEUE_URL`, `UNDERWRITE_SQS_REGION`, `UNDERWRITE_MODAL_QUEUE_NAME` env vars
- KFS env vars (`UNDERWRITE_KFS_COOLING_OFF_DAYS`, `UNDERWRITE_KFS_DISCLOSURE_VERSION`)
- 9 Indian-market docs updated (ENVIRONMENT_VARIABLES, CONFIGURATION, DOMAIN_MODEL, SECURITY, QUICKSTART, API, DEPLOYMENT, ROADMAP, OPERATIONS)
- Honest README.md with beta warning and known gaps documented

### Changed
- **Compliance service** — from basic PAN/Aadhaar regex to PAN category detection, Aadhaar Verhoeff checksum, weighted keyword AML risk scoring (low/flagged/frozen), CKYC event emission, video KYC lifecycle hooks, consent pre-check
- **Pricing service** — from generic rate computation to RBI-compliant: per-product rate caps (home 12%, gold 18%, personal 28%, micro 30%), all-in-cost APR, penal interest cap (24%), foreclosure charge computation, EMI amortization, DTI calculation, GST disclosure
- **Recovery service** — from in-memory-only (state lost on restart) to store-backed persistence via TypedStoreRepository with duplicate default detection
- **__config__.py** — added `kfs`, `npa`, `dpdpa`, `razorpay`, `credit_bureau`, `underwriting` config sections; refactored SERVICE_NAMES to include consent, dsr, credit_bureau, kfs
- **__service_registry__.py** — wiring updated for new compliance/pricing/recovery event names
- **docker-compose.yml** — from filesystem-only to Postgres 16 + Vault + OTLP collector
- **Base service** — refactored `StatefulService` store_repo/batched_repo factory methods
- **PostgresStore** — migration engine uses lock_timeout and statement_timeout for safety
- `UNDERWRITE_AUDIT_EXPORT_URL` env var added for audit log offloading
- PII redaction — Aadhaar-like 12-digit and PAN-like patterns redacted in logs and audit
- `LocalBus` lifecycle: a freshly constructed bus is now considered running.
  `start()` is idempotent and flushes the buffer only on the first call.

### Fixed
- `UNDERWRITE_RECOVERY_BACKOFF` env var now correctly maps to `recovery.backoff_seconds`
- `communication` service test isolation — removed flaky shared state dependency
- `UNDERWRITE_SECRETS_AWS_REGION` accepts empty string for fallback to env default
- `__secrets__` backend fallback ordering — Vault/AWS not tried when `backend=env`
- Vault `KVv2` secret path handling — mounts at correct engine path
- Fixed broken `docs/ARCHITECTURE.md` link in README (should be `architecture.md`)
- **CLI `underwrite health` and `/v1/health` always reported `ok: True`** —
  the bus health probe looked for a non-existent `_EventBus__subscriptions`
  attribute and a non-existent `is_stopped()` method, so every bus was
  reported healthy. Replaced with `LocalBus.subscriber_count()` and
  `LocalBus.is_stopped()`.
- **`Runtime.publish` always failed signature verification** — events were
  emitted with `source="runtime"` and an empty signature, so every authz-
  enabled subscriber routed the event to the DLQ. Runtime now holds an
  `Identity` for the `runtime` service, signs outbound events (binding
  event id, timestamp, type, source and payload), and registers its
  public key in the authz trust set.
- **Ed25519 signatures did not bind `event.source` and had no replay
  window** — the signed payload was `event_id:timestamp:event_type:payload`
  and a captured event verified forever. The canonical signed bytes
  (`Event.canonical_sign_bytes()`) now bind the source and the
  `AccessControl` enforces a 5-minute clock window
  (`AccessControl.set_replay_window` to override; set to 0 to disable).
- **Identity keys were in-memory only** — every restart generated a new
  Ed25519 keypair so historical events could no longer be verified.
  `Identity.create` now accepts a `SecretsManager`, loads an existing
  PEM key when present, and persists newly generated keys. New
  `Identity.to_pem()` / `Identity.persist()` helpers expose the private
  key for storage. `Runtime` and `NanoService` now plumb the runtime
  `SecretsManager` so service identities survive restarts.
- **Indian holiday calendar silently stopped working past 2027** — the
  moveable-holiday table was hard-coded to 2025–2027, so any due-date
  in 2028 or later missed Republic Day, Diwali, Eid and the rest. The
  table now extends through 2030 and queries for unknown years fall
  back to fixed holidays plus Sunday/2nd-Saturday/4th-Saturday rules
  with a logged warning rather than returning all-business-days.
- **`/v1/publish` accepted arbitrary source identity** — any client with
  the bearer token could publish events attributed to any source. The
  endpoint now requires a `source` field, validates its shape, looks
  up or lazily creates an Ed25519 identity for that source via the
  runtime `SecretsManager`, and signs the event with that identity.
  When authz is enabled, the source must be already trusted or the
  request is rejected.
- **Razorpay webhook signature verified against a client-supplied secret**
  — the service read `webhook_secret` from the untrusted event payload
  and passed it straight into the HMAC check, so an attacker could
  submit their own secret in a forged webhook and bypass the signature.
  The service now pulls the secret from the configured Razorpay client
  (`RazorpayClient.webhook_secret()`) and rejects webhooks when the
  client has no secret configured. Tests updated to set the secret
  on the mock client.
- **Plugin discovery loaded arbitrary code from any installed package**
  — `Plugins.discover()` iterated every `underwrite.services` entry
  point with no allowlist, so a typosquatted dependency could gain
  full process privileges. Plugins now require an explicit
  `UNDERWRITE_PLUGINS` allowlist; entry points not in the allowlist
  are logged and ignored. Setting `UNDERWRITE_PLUGINS=*` re-enables
  the legacy behaviour with a logged warning.
- **PAN validator rejected valid PANs** — `require_pan` accepted only
  4th-character letters `ABCFGHJLPT` (10 letters). Income Tax also
  issues PANs with 4th character `E` and `K`; the validator now
  accepts the full ITD set `ABCEFGHJKLPT` and rejects every other
  letter. New regression tests cover both directions.

### Added Tests
- 138-line compliance test suite: PAN format + category, Aadhaar Verhoeff checksum, AML frozen/flagged/cleared, CKYC/video KYC events, consent pre-check, status queries
- 202-line recovery test suite: start/offer/accept/reject, escalation, partial/full payment, completion, store persistence, duplicate dedup
- Multi-saga concurrency tests — parallel saga execution with per-saga locks
- Notification channel dispatch tests (SES/Twilio)
- PII redaction edge-case tests (Aadhaar/PAN patterns)
- Circuit breaker open/half-open/close state transitions

### Removed
- `underwrite/version.py` (manual) — replaced by setuptools-scm auto-generated `__version__.py`
- `docs/api-reference.md`, `docs/getting-started.md`, `docs/index.md` — consolidated into docs/
- `TODO.md` — replaced by `docs/ROADMAP.md` and GitHub Issues
- `.pre-commit-config.yaml` (pre-commit hooks removed from repo)
- Flaky `test_communication.py` tests — removed 12 dead/duplicate test cases
- Misleading "Production-hardened" and "828+ tests" claims in README

### Security
- PII redaction — Aadhaar (12-digit), PAN, Voter ID, passport, bank account patterns masked in logs

---

## [0.6.2] — 2026-06-16

### Added
- SQS distributed event bus backend — production-scale event distribution
- Modal distributed event bus backend — serverless event bus
- DPDPA 2023 compliance configuration (consent, DSR, breach notification)
- RBI NPA provisioning rates (standard 0.25%, substandard 15%, doubtful 25%, loss 100%)
- SMA classification thresholds (SMA-0: 30d, SMA-1: 60d, SMA-2: 90d)
- Credit bureau multi-bureau config (CIBIL, Experian, Equifax + CKYC)
- Razorpay payment gateway config (UPI Autopay, e-NACH)
- KFS cooling-off period config (3 days per RBI DLG)
- Underwriting rules engine config (credit score, DTI, LTV caps)
- AML blocklist path env var for risk scoring
- Per-product RBI pricing cap env vars (personal, micro, penal)
- SQS/Modal bus env vars for distributed deployment

### Fixed
- `UNDERWRITE_RECOVERY_BACKOFF` mapping to correct config field
- Communication test isolation (removed shared state)
- AWS Secrets Manager fallback when `backend=env`
- Vault KVv2 path resolution
- `UNDERWRITE_SECRETS_AWS_REGION` empty-string handling

---

## [0.6.1] — 2026-06-15

### Added
- Compliance service: PAN category detection, Aadhaar Verhoeff checksum, AML risk scoring (keyword-weighted with low/flagged/frozen states), CKYC event emission, video KYC lifecycle hooks, consent pre-check
- Pricing service: RBI rate caps (home 12%, gold 18%, personal 28%, micro 30%), all-in-cost APR, penal interest cap (24%), foreclosure charges, EMI amortization, DTI, GST disclosure
- Recovery service: store-backed persistence via TypedStoreRepository
- Event registry: `aml.flagged`, `kyc.video_initiated`, `kyc.video_verified`, `pricing.penal_interest`, `pricing.foreclosure`, recovery.offer/escalated/progress
- Test suites: compliance (138 lines, 34 tests), recovery (202 lines, 15 tests), multi-saga concurrency

### Changed
- docker-compose.yml: filesystem → PostgreSQL 16 + Vault + OTLP collector
- `.env.example`: comprehensive env vars for all backends, compliance, pricing thresholds
- StatefulService: refactored store_repo/batched_repo factory methods
- PostgresStore: lock_timeout and statement_timeout for migration safety
- PII redactor: Aadhaar/PAN pattern coverage extended

---

## [0.6.0] — 2026-06-14

### Added
- Service registry wiring for 9 new Indian-lending event types
- `consent` and `dsr` to `SERVICE_NAMES` (were missing, preventing service enablement)
- Audit export URL env var for external audit log shipping
- Template-based `.env.example` with all sections documented

### Changed
- Config sections added: `kfs`, `npa`, `dpdpa`, `razorpay`, `credit_bureau`, `underwriting`
- `__config__.py` refactored for Indian lending parameters
- `__bus__.py` — improved backpressure handling and future tracking

### Fixed
- `__service_registry__.py` missing wiring for consent, dsr services
- `__bus__.py` — dead future reference cleanup on service shutdown

---

## [0.5.4] — 2026-06-10

### Added
- Async bus recovery — graceful reconnection on Redis/pub-sub failures
- Multi-saga concurrency test — parallel saga execution safety

### Fixed
- Saga rollback ordering — compensation events emitted in reverse step order
- Missing `correlation_id` propagation in saga compensation events
- Circuit breaker half-open timeout not resetting after success

---

## [0.5.3] — 2026-06-09

### Added
- PII pattern redaction for Aadhaar (12-digit), PAN (5 letters + 4 digits + letter)
- Voter ID and passport pattern redaction in logs
- Audit export URL config for remote log shipping

### Changed
- PostgresStore — query timeout configuration (lock_timeout, statement_timeout)
- Migration engine — transaction-per-version with explicit commit/rollback

### Fixed
- Postgres connection pool leak on migration failure
- `CircuitBreaker` state not resetting after recovery timeout
- `MetricsCollector` timer edge case with zero-duration operations

---

## [0.5.2] — 2026-06-08

### Added
- Distributed rate limiter — window-slot key pattern replacing TOCTOU get/set
- Postgres lock timeout safety for concurrent migration execution
- Dead-letter queue persistence across restarts (FileStore/PostgresStore)

### Changed
- `NanoService.__dispatch` — error logging includes correlation_id
- `SagaOrchestrator` — per-saga RLock instead of global lock
- `OtlpSpanExporter` — lazy SDK initialization at construction time

### Fixed
- Double event processing on service restart — idempotency guard extended
- `UNDERWRITE_BUS_MAX_WORKERS=0` now correctly disables thread pool

---

## [0.5.1] — 2026-06-07

### Added
- Notification channel dispatch — SES email + Twilio SMS via ThreadPoolExecutor
- Health check endpoint now reports per-service event counts
- `bus` property on `NanoService` for downstream access

### Changed
- `ServicingService` — refinanced loan handling with idempotency
- `postgres` extra now pins psycopg2-binary instead of psycopg2
- CI pipeline: Python 3.13 added to test matrix, 3.10 retained

### Fixed
- `ServicingService.handle()` — `self.bus` access via property instead of mangled attribute
- `disbursement/service.py` — missing `logger` import
- Document service UUID collision — full 32-char hex UUID
- Mechanism zero-recovery — `__default` includes principal field in payload

---

## [0.5.0] — 2026-06-06

### Added
- Comprehensive 37-page documentation site under `docs/` — architecture, system design, domain model, API reference, deployment, operations, security, troubleshooting
- 4 Architecture Decision Records (ADR): nano-service architecture, event-driven communication, Ed25519 provenance, saga orchestration
- `setup.sh` — idempotent environment bootstrap (venv, deps, pre-commit, validation)
- `lint.sh`, `test.sh`, `format.sh`, `cleanup.sh` — standalone scripts
- CI security scanning: bandit static analysis + pip-audit dependency auditing
- Docker build + smoke test in CI pipeline
- Postgres testcontainer fixtures, HTTP TestClient fixture, failure-mock fixtures in conftest.py
- `UNDERWRITE_ALLOW_JOBLIB` env var to gate joblib deserialization (disabled by default)
- `RISK_MODEL_SHA256` verification for risk model file integrity

### Changed
- PostgresStore pool: hand-rolled list+lock → psycopg2.pool.ThreadedConnectionPool
- MechanismService: snapshot/rollback pattern with state_lock held during store write
- Sagas: global RLock → per-saga RLock for concurrent execution
- Each migration version wrapped in its own transaction
- Risk model: JSON by default; joblib requires explicit opt-in
- Fee payment check moved entirely inside state_lock

### Fixed
- Event signature forgery — removed `json.dumps(default=str)` from signing
- Silent data loss — StoreRepository.save() no longer swallows Exception
- Double disbursement — idempotency guard in disbursement service
- Concurrent mutation loss — state lock held across store write
- Container ran as root — added USER underwrite to Dockerfile
- Port mismatch — docker-compose.yml port changed to 8000:8080

### Security
- Ed25519 signature verification enforced on all events
- Risk model integrity — SHA-256 verification; joblib gated behind explicit opt-in

---

## [0.4.0] — 2026-06-03

### Added
- Service lifecycle — supervisor auto-restart with configurable backoff
- Dead-letter queue — event capture, inspection, and replay via CLI
- Window-slot rate limiter for bus subscribers
- `__supervisor__.py` — monitors and restarts failing services
- `UNDERWRITE_RECOVERY_AUTO_RESTART`, `MAX_RESTARTS`, `BACKOFF` env vars
- Dead-letter queue persistence with CLI replay (`underwrite dlq --replay`)

### Changed
- `AsyncLocalBus` — per-handler timeouts (30s), CancelledError handling
- `__config__.py` — env var overrides for recovery settings
- Configuration loading — strict validation of unknown keys raises ConfigurationError
- Test isolation — all integration tests use dedicated store/bus instances

### Fixed
- Dead-letter queue records persist across bus restarts
- MemoryStore eviction distinguishes new keys from key updates
- Service dispatch no longer silently drops handler exceptions
- Bus health endpoint validates bus isn't stopped (not just alive)

### Security
- `UNDERWRITE_AUTHZ_ENABLED` gating for Ed25519 signature verification
- Authorization policy file support via `UNDERWRITE_AUTHZ_POLICY_FILE`
- Crypto availability warning when `cryptography` library is missing

---

## [0.3.3] — 2026-05-31

### Added
- Configuration recovery settings — auto_restart, max_restarts, backoff_seconds
- Service supervisor — monitors registered services, restarts on failure

### Changed
- `AsyncLocalBus` — improved concurrency with per-handler futures tracking
- Configuration loading — unknown keys raise ConfigurationError

### Fixed
- DLQ records now correctly persist across bus restarts
- MemoryStore eviction correctly distinguishes new inserts from updates
- Service dispatch no longer silently drops slow-handler exceptions

---

## [0.3.2] — 2026-05-29

### Added
- Kubernetes liveness/readiness probes (/healthz, /readyz)
- bandit security linter configuration in pyproject.toml
- Docker health check instruction

### Changed
- Port mapping fix: docker-compose host 8000 → container 8080
- Container user: root → underwrite (UID 1001)
- PostgresStore uses psycopg2.pool.ThreadedConnectionPool

### Fixed
- Dockerfile — addgroup/adduser with USER underwrite
- docker-compose.yml — added restart: unless-stopped

---

## [0.3.1] — 2026-05-27

### Added
- `uv.lock` — deterministic dependency lockfile
- Notification service — base channel dispatch infrastructure
- Document service — template rendering and PDF generation stubs

### Changed
- Risk model loading — lazy sklearn imports; model loaded on first handle()
- `__runtime__.py` — readonly mode for health/metrics without service startup

### Fixed
- ServicingService.handle() accesses self.bus via public property
- Missing logger import in disbursement/service.py

---

## [0.3.0] — 2026-05-26

### Added
- Circuit breaker infrastructure — per-subscriber failure tracking
- Per-handler timeout (30s) — slow handlers routed to DLQ
- Event payload size validation (>1 MB raises ProtocolError)
- `UNDERWRITE_BUS_MAX_FUTURES` configurable pending futures limit

### Changed
- British → American English in all docstrings
- logger.debug(exc_info=True) → logger.warning in bus trim_futures
- Metrics export interval configurable via env var

### Fixed
- MemoryStore eviction: distinguishes new keys from updates
- AsyncBus dispatch loop: handles CancelledError for clean shutdown

---

## [0.2.0] — 2026-05-25

### Added
- `.env.example` — documented all UNDERWRITE_* environment variables
- `.pre-commit-config.yaml` — pre-commit hooks for linting/formatting
- Test suites: bus extras, fee, fraud, mechanism, saga, store
- TODO.md — project roadmap (since replaced by docs/ROADMAP.md)

### Changed
- `__bus__.py` — DLQ replay support; configurable rate limiter window
- `__config__.py` — Configuration.default() returns sensible defaults
- `__cli__.py` — underwrite init creates config with mechanism + audit enabled
- PII redaction — field name matching uses case-insensitive regex

### Fixed
- Identity key TTL enforcement with grace period
- Store DSN parsing for Postgres connection strings with special characters

### Security
- PII redactor masks passwords, tokens, SSNs, credit card numbers, API keys in logs
- `UNDERWRITE_AUTHZ_ENABLED` defaults to true

---

## [0.1.1] — 2026-05-22

### Added
- CONTRIBUTING.md, SECURITY.md
- conftest.py — shared test infrastructure
- Test suites: audit, configuration, concurrency faults, risk faults, runtime faults, secrets faults, supervisor faults

### Changed
- Access control — service identity binding with key rotation
- Event bus — subscriber registration validates handler signatures
- CLI — list, health, dlq, metrics with structured output
- Config — env var overrides for all subsystems

### Fixed
- pyproject.toml setuptools package discovery (non-recursive find)
- mypy type errors across codebase

---

## [0.1.0] — 2026-05-20

### Added
- Initial nano-service platform implementation
- Core infrastructure: event bus, state store, saga orchestrator, access control, circuit breaker, configuration, runtime, CLI, FastAPI HTTP server
- Event system: typed EventType enum, Ed25519 cryptographic signatures
- 28 nano-services: mechanism, risk (ML), fraud, KYC/AML, collateral, fee, origination/servicing, collections, recovery, notifications, document, governance, pricing, provisioning, disbursement
- Pluggable stores: MemoryStore, FileStore, PostgresStore
- Observability: Prometheus metrics, OpenTelemetry tracing, structured JSON logging with PII redaction
- Resilience: dead-letter queue, retry policies, circuit breakers, idempotency guards
- HTTP API: /v1/health, /v1/metrics, /v1/publish with bearer auth and rate limiting
- Docker: multi-stage Dockerfile, docker-compose.yml
- CI/CD: GitHub Actions pipeline (lint, type-check, test across Python 3.10–3.13)
- Testing: 828+ tests across 58 test files (property-based, load, mutation, chaos)

---

[Unreleased]: https://github.com/sachncs/underwrite/compare/v0.6.2...HEAD
[0.6.2]: https://github.com/sachncs/underwrite/releases/tag/v0.6.2
[0.6.1]: https://github.com/sachncs/underwrite/releases/tag/v0.6.1
[0.6.0]: https://github.com/sachncs/underwrite/releases/tag/v0.6.0
[0.5.4]: https://github.com/sachncs/underwrite/releases/tag/v0.5.4
[0.5.3]: https://github.com/sachncs/underwrite/releases/tag/v0.5.3
[0.5.2]: https://github.com/sachncs/underwrite/releases/tag/v0.5.2
[0.5.1]: https://github.com/sachncs/underwrite/releases/tag/v0.5.1
[0.5.0]: https://github.com/sachncs/underwrite/releases/tag/v0.5.0
[0.4.0]: https://github.com/sachncs/underwrite/releases/tag/v0.4.0
[0.3.3]: https://github.com/sachncs/underwrite/releases/tag/v0.3.3
[0.3.2]: https://github.com/sachncs/underwrite/releases/tag/v0.3.2
[0.3.1]: https://github.com/sachncs/underwrite/releases/tag/v0.3.1
[0.3.0]: https://github.com/sachncs/underwrite/releases/tag/v0.3.0
[0.2.0]: https://github.com/sachncs/underwrite/releases/tag/v0.2.0
[0.1.1]: https://github.com/sachncs/underwrite/releases/tag/v0.1.1
[0.1.0]: https://github.com/sachncs/underwrite/releases/tag/v0.1.0
