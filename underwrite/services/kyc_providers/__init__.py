"""KYC provider integrations — PAN, Aadhaar (eKYC), CIBIL, CKYC.

Each provider client implements the same ``KycProvider`` ABC and
returns a ``ProviderResult`` carrying a ``Verdict`` enum plus the
provider's structured response. Clients are configured through the
runtime ``Configuration`` and authenticate with provider-specific
secrets held in the configured ``SecretsManager``.

Production deployments must register the provider credentials via
the secrets backend (Vault, AWS Secrets Manager, or env var) and
set the matching ``api_key`` / ``client_id`` / ``client_secret`` in
the provider config block. The sandbox endpoints are used by
default; production deployments set ``api_base_url`` to the
provider's live URL.
"""
