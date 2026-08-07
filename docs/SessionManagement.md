# Multi-Device Session Management Guide — SubPulse

## Session Schema & Lifecycle
Each login creates a `Session` document containing:
- `familyId`: Token rotation family identifier.
- `refreshTokenHash`: Current SHA-256 hash of active refresh token.
- `device`, `browser`, `os`, `ipAddress`, `location`: Device metadata parsed from User-Agent.
- `lastSeen`: Timestamp of most recent activity.
- `isRevoked`, `revokedReason`: Revocation status.

---

## 🚪 Session Revocation Endpoints
```bash
GET /api/v1/auth/sessions         # Returns all active sessions for logged in user
DELETE /api/v1/auth/sessions/:id   # Revokes specific device session
POST /api/v1/auth/logout-all       # Revokes all active sessions for user
```
