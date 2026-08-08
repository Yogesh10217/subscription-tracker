# Analytics API Reference Catalog — SubPulse

## Analytics Endpoints (`/api/v1/analytics`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/summary` | Yes | Dashboard summary (metrics, insights, recent price hikes) |
| `GET` | `/spending` | Yes | Projected recurring & historical actual spend by currency |
| `GET` | `/subscriptions` | Yes | Lifecycle counts and state flags |
| `GET` | `/categories` | Yes | Category spend, counts, %, avg costs |
| `GET` | `/providers` | Yes | Provider spend, counts, avg costs |
| `GET` | `/renewals` | Yes | Renewals in 7, 30, 90 days & costs |
| `GET` | `/trials` | Yes | Active trials, expirations, conversion rate % |
| `GET` | `/trends` | Yes | Monthly time-series trends |
| `GET` | `/price-changes` | Yes | Price increase & decrease audit logs |
| `GET` | `/insights` | Yes | Rule-based explainable insights |
