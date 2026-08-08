# Custom Reminder Rules Guide — SubPulse

## Rule Types & Schedules
- `1_DAY_BEFORE`: Trigger alert 1 day prior to renewal.
- `3_DAYS_BEFORE`: Trigger alert 3 days prior to renewal.
- `7_DAYS_BEFORE`: Trigger alert 7 days prior to renewal.
- `14_DAYS_BEFORE`: Trigger alert 14 days prior to renewal.
- `30_DAYS_BEFORE`: Trigger alert 30 days prior to renewal.
- `CUSTOM`: Trigger alert on a specific custom date.

```bash
POST /api/v1/subscriptions/:id/reminders   # Create reminder rule
GET /api/v1/subscriptions/:id/reminders    # List active reminder rules for subscription
```
