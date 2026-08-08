# Notification Reliability Guide — SubPulse

## Guarantees
1. **Idempotency**: SHA-256 idempotency key prevents duplicate deliveries.
2. **Failure Classification**:
   - `TRANSIENT` (retried with exponential backoff: 1m, 5m, 15m, 30m, 60m)
   - `PERMANENT` (fails immediately)
3. **Delivery Semantics**:
   - `deliveryStatus = SENT` (SMTP accepted)
   - `deliveryStatus = DELIVERED` (In-App)
   - `readAt = Date` (User read timestamp)
