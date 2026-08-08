# Activity Timeline & Price/Renewal History Guide — SubPulse

## Event Types Recorded
- `CREATED`: Subscription creation.
- `EDITED`: General property updates.
- `PRICE_CHANGE`: Price amount or currency modifications.
- `RENEWAL`: Renewal date extension or automated renewal.
- `PAUSED`: Subscription paused.
- `CANCELLED`: Subscription cancelled.
- `ARCHIVED` / `RESTORED`: State changes.
- `IMPORTED`: Created via CSV/JSON import pipeline.

```bash
GET /api/v1/subscriptions/:id/timeline        # Full event timeline
GET /api/v1/subscriptions/:id/price-history   # Filtered price change log
GET /api/v1/subscriptions/:id/renewal-history # Filtered renewal log
```
