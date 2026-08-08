# Notification Preferences & Quiet Hours Guide — SubPulse

## Preferences Governance
SubPulse checks user notification preferences before generating or sending notifications:
- Channel controls (`emailEnabled`, `inAppEnabled`)
- Category toggles (`renewalReminders`, `trialReminders`, `priceChangeAlerts`, `subscriptionLifecycleAlerts`)
- Timezone resolution (`timezone` parameter)
- Quiet Hours (`quietHoursEnabled`, `quietHoursStart`, `quietHoursEnd`)
