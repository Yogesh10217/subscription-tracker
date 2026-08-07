# Enterprise Authentication Platform Architecture — SubPulse

## Overview
SubPulse implements a multi-tenant ready, enterprise-grade authentication platform centered around short-lived Access Tokens (15 min), long-lived Refresh Token Families (7 days), hashed token storage, and session-based device tracking.

---

## 🔄 Refresh Token Family Rotation & Replay Protection

```
┌──────────────────────────────────────────────────────────┐
│ Initial Login                                            │
│ -> Generates Access Token (15m) + Refresh Token (7d)     │
│ -> Creates Session Record with Family ID                 │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│ Token Refresh (Rotates Token)                             │
│ -> Invalidates previous Refresh Token                    │
│ -> Issues new Access + Refresh Token pair                │
│ -> Updates Session record with parentToken & new token   │
└────────────────────────────┬─────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│ Replay Attack Detection                                  │
│ -> If an OLD/REVOKED Refresh Token is presented:          │
│ -> System flags Security Breach Alert                    │
│ -> REVOKES ENTIRE TOKEN FAMILY IMMEDIATELY               │
│ -> Logs Audit Event TOKEN_REPLAY_BREACH_DETECTED         │
└──────────────────────────────────────────────────────────┘
```

---

## 🔒 Account Lockout Protection
- Failed attempts counter (`failedLoginAttempts`).
- Account locks for 15 minutes after 5 consecutive failed login attempts.
- Automatic unlocking upon duration expiration.
