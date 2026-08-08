# Spending Analytics & Currency Handling Guide — SubPulse

## Separation of Projected vs. Historical Spend
- **Projected Recurring Spend**: Derived from current active subscription price and normalized frequency multiplier.
- **Historical Actual Spend**: Derived strictly from recorded `RENEWAL` timeline events.

---

## Frequency Normalization Table
- `Daily`: Monthly = `price * 30.4167`, Yearly = `price * 365`
- `Weekly`: Monthly = `price * 4.3333`, Yearly = `price * 52`
- `Monthly`: Monthly = `price`, Yearly = `price * 12`
- `Quarterly`: Monthly = `price / 3`, Yearly = `price * 4`
- `Yearly`: Monthly = `price / 12`, Yearly = `price`
- `Custom`: Custom interval formula based on `customIntervalUnit` and `customIntervalValue`.
