# Analytics Architecture Guide — SubPulse

## Subsystem Boundary (`src/analytics/`)
SubPulse Analytics operates as a read-only, deterministic subsystem isolated inside `src/analytics/`. It derived metrics strictly from MongoDB application data without mutating business state or relying on external AI services.

---

## 🏗️ Analytics Architecture Components

```text
Request -> AnalyticsController -> AnalyticsService -> Query/Calculator -> MongoDB -> Response Contract
```

- **Calculators (`src/analytics/calculators/`)**: `frequency-normalizer.js`, `spending-calculator.js` (Handles deterministic frequency multipliers and safe multi-currency grouping).
- **Context (`src/analytics/context/`)**: `analytics-query-context.js` (Unified context parameter envelope across all queries).
- **Time Range (`src/analytics/time-range.engine.js`)**: Timezone-aware date interval resolver.
- **Insights Engine (`src/analytics/insights/`)**: `insights.rules.js` & `insight-engine.js` (Deterministic rule evaluation producing explainable alerts with `INFO`, `WARNING`, and `IMPORTANT` severities).
- **Contracts (`src/analytics/contracts/`)**: Formats API response payloads.
