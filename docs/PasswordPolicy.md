# Password Security Policy & History Reuse Rules — SubPulse

## 🔐 Password Complexity Requirements
Every new password (registration, reset, change) must satisfy:
1. Minimum length of **8 characters**.
2. At least **1 uppercase letter** (`A-Z`).
3. At least **1 lowercase letter** (`a-z`).
4. At least **1 number** (`0-9`).
5. At least **1 special character** (`!@#$%^&*()_+-=[]{};':"\\|,.<>/?`).
6. Must not contain common weak words (`password`, `123456`, `admin123`, etc.).

---

## 🚫 Password Reuse Prevention
SubPulse stores the last 3 hashed passwords in `user.passwordHistory`. Any attempt to reuse a recent password triggers an HTTP 400 error.
