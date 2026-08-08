# Notification Providers Guide — SubPulse

## Abstract Provider Interface
Delivery providers implement `NotificationProviderInterface`:
- `send(notification)`
- `validate(notification)`
- `healthCheck()`

`EmailProvider` wraps Nodemailer transport to process EMAIL delivery.
