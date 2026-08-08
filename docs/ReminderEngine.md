# Reminder Engine & Scheduling Guide — SubPulse

## Engine Logic
`ReminderEngineService` scans active subscriptions against enabled `ReminderRule` entries (e.g. 1, 3, 7, 30 days before renewal).
Notifications are generated with a deterministic SHA-256 `idempotencyKey` inserted atomically into MongoDB to guarantee zero duplicate creation under multi-container concurrent execution.
