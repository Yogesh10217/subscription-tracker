# Multi-Stage Import & Flexible Export Engine Guide — SubPulse

## Import Pipeline Stages
1. **Validation (`POST /api/v1/subscriptions/import/preview`)**: Validates field types, mandatory fields, and formatting without DB calls.
2. **Dry Run (`POST /api/v1/subscriptions/import/dry-run`)**: Compares against existing subscriptions to detect duplicates.
3. **Execution (`POST /api/v1/subscriptions/import`)**: Creates subscriptions, emits `IMPORTED` timeline events, and issues rollback tokens.

---

## Data Export formats
- **JSON**: `GET /api/v1/subscriptions/export?format=json`
- **CSV**: `GET /api/v1/subscriptions/export?format=csv`
