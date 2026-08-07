# Security Architecture & Response Headers Guide — SubPulse

## Overview
SubPulse enforces OWASP Security Top 10 recommendations through Helmet middleware, SHA-256 hashed verification tokens, constant-time password comparison, and granular rate limiting.

---

## 🛡️ Security Measures
1. **Security Response Headers (Helmet)**:
   - `Content-Security-Policy`: Standard default directives.
   - `Strict-Transport-Security`: HSTS enabled in production.
   - `X-Content-Type-Options`: `nosniff`.
   - `X-Frame-Options`: `SAMEORIGIN`.
2. **Hashed Token Storage**: Plaintext verification and password reset tokens are NEVER stored in database. All tokens are stored as SHA-256 hashes (`crypto.createHash('sha256')`).
3. **Structured Audit Logging**: Security-sensitive actions (`LOGIN_SUCCESS`, `LOGIN_FAILED`, `ACCOUNT_LOCKED`, `SESSION_REVOKED`, `TOKEN_REPLAY_BREACH`) persist to `AuditLog`.
