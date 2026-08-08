# Metrics Definition Catalog — SubPulse

## Metrics Inventory

| Metric | Name | Source Data | Currency Handling | Edge Cases |
|---|---|---|---|---|
| Projected Monthly Spend | `projected_monthly_spend` | Active Subscriptions | Grouped by Currency | Excludes deleted & archived |
| Projected Yearly Spend | `projected_yearly_spend` | Active Subscriptions | Grouped by Currency | Excludes deleted & archived |
| Historical Spend | `historical_spend` | `TimelineEvent` (RENEWAL) | Grouped by Currency | Date range bounded |
| Active Count | `active_subscription_count` | Subscriptions (status=Active) | Currency independent | Excludes soft deleted |
| Trial Count | `trial_subscription_count` | Subscriptions (isTrial=true) | Currency independent | Includes running trials |
| Trial Conversion Rate | `trial_conversion_rate` | `TimelineEvent` (TRIAL_CONVERSION) | Currency independent | 0% if total trials = 0 |
