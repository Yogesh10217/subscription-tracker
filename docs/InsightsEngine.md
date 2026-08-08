# Rule-Based Insights Engine Guide — SubPulse

## Deterministic Rule Catalog
Insights are evaluated against aggregated metrics using explicit rules:
- `TOP_CATEGORY_CONCENTRATION`: Triggered when top category spend >= 40%.
- `UPCOMING_RENEWALS_NOTICE`: Triggered when 30-day renewals > 0.
- `RECENT_PRICE_HIKE_ALERT`: Triggered when price increase events exist.
- `ACTIVE_TRIAL_EXPIRATION`: Triggered when active running trials exist.
- `LARGEST_RECURRING_EXPENSE`: Highlights largest single subscription per currency.

---

## Severity Levels
- `INFO`: Helpful contextual notifications.
- `WARNING`: Attention-requiring thresholds (price hikes, category concentration).
- `IMPORTANT`: Time-critical financial actions (upcoming renewals).
