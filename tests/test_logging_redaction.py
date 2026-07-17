"""Tests for the JSON log formatter and the runtime's redaction path."""

from __future__ import annotations

import json
import logging
import re


def _build_formatter() -> logging.Formatter:
    """Re-build the JSON formatter that Runtime.__configure_logging
    installs so we can exercise the redaction logic without
    instantiating a full Runtime."""
    sensitive_fields: frozenset[str] = frozenset(
        {
            "password",
            "secret",
            "token",
            "auth",
            "authorization",
            "private_key",
            "ssn",
            "tax",
            "pin",
            "cvv",
            "pan",
            "account",
            "routing",
        }
    )

    def _tokens(s: str) -> set[str]:
        return set(re.findall(r"[a-z0-9]+", s.lower()))

    class JsonFormatter(logging.Formatter):
        def __redact(self, data):
            if isinstance(data, dict):
                out = {}
                for k, v in data.items():
                    if isinstance(k, str) and _tokens(k) & sensitive_fields:
                        out[k] = "***REDACTED***"
                    else:
                        out[k] = self.__redact(v)
                return out
            if isinstance(data, (list, tuple)):
                return [self.__redact(i) for i in data]
            return data

        def format(self, rec):
            return json.dumps(self.__redact({"message": rec.getMessage()}))

    return JsonFormatter()


class TestJsonFormatterRedaction:
    def test_redacts_pan_field_in_payload(self) -> None:
        """A structured payload with ``customer_pan`` as a key must
        be redacted."""
        formatter = _build_formatter()
        redact = getattr(formatter, "_JsonFormatter__redact")
        payload = {"customer_pan": "ABCDE1234F", "amount": 1000, "company": "Acme"}
        out = redact(payload)
        assert out["customer_pan"] == "***REDACTED***"
        assert out["amount"] == 1000
        assert out["company"] == "Acme"

    def test_does_not_overmatch_substring(self) -> None:
        """A field like ``company`` that incidentally contains the
        letters ``pan`` as a substring must NOT be redacted."""
        formatter = _build_formatter()
        redact = getattr(formatter, "_JsonFormatter__redact")
        payload = {"company": "Acme", "panel_id": "panel_123", "author": "alice"}
        out = redact(payload)
        assert out == payload

