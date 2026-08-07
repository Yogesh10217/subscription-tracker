# API Authentication Reference Catalog — SubPulse

## Authentication Endpoints (`/api/v1/auth`)

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/sign-up` | No | Registers new account & sends email verification |
| `POST` | `/sign-in` | No | Authenticates credentials & sets HTTP-only cookie |
| `POST` | `/refresh` | No | Rotates refresh token & issues new Access Token |
| `POST` | `/forgot-password` | No | Generates password reset token & emails user |
| `POST` | `/reset-password` | No | Resets password using verification token |
| `POST` | `/verify-email` | No | Verifies email using token |
| `POST` | `/logout` | Yes | Revokes current session & clears cookie |
| `POST` | `/logout-all` | Yes | Revokes all active user sessions |
| `POST` | `/change-password` | Yes | Changes password verifying current password |
| `POST` | `/resend-verification` | Yes | Resends verification token email |
| `GET` | `/sessions` | Yes | Retrieves list of active device sessions |
| `DELETE` | `/sessions/:id` | Yes | Revokes a specific device session |
