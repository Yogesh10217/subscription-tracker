# QStash Troubleshooting Guide

## Overview of QStash Architecture
SubPulse uses Upstash QStash for reliable message delivery and delayed execution of background jobs, such as subscription renewal reminders. The application integrates with the Upstash Cloud SDK.

1.  **Publisher (`subscription.service.js`):** Uses `triggerWorkflowSafely` to queue the message via `workflowClient.trigger`.
2.  **Worker Endpoints:** QStash sends a POST request with the message payload to the specified callback URL.
    *   `POST /api/v1/workflows/subscription/reminder`
    *   `POST /api/v1/notifications/worker`
3.  **Callback Authentication:** Worker endpoints verify requests by checking the presence of a header (either `Authorization` or `upstash-signature`). For local/development workflows, crypto verification is often skipped or mocked.

## Environment Variables
Ensure the following variables are set correctly in your `.env`:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `QSTASH_URL` | Upstash QStash API endpoint. | `https://qstash.upstash.io/v2/messages` |
| `QSTASH_TOKEN` | Bearer token for API access. | `ey...` |
| `QSTASH_CURRENT_SIGNING_KEY` | Key for verifying incoming signatures. | `sig_...` |
| `QSTASH_NEXT_SIGNING_KEY` | Next key in rotation for verifying signatures. | `sig_...` |
| `QSTASH_CALLBACK_URL` | Your app's public URL for callbacks. | `https://api.yourdomain.com` |

## Common Issues & Behavior
*   **Connection Failure (`ECONNREFUSED`):** If the Upstash API is unreachable, the system will catch the `ECONNREFUSED` error and gracefully fall back to local `node-cron` processing.
*   **Timeout Behavior:** QStash requests that exceed the designated timeout will fail and might be retried according to the QStash retry policy.
*   **`localhost:8090` Explanation:** A loopback address like this typically means you are using a local mock QStash server instead of the Upstash Cloud. This is expected in development, but not production.

## Diagnostic Script Usage
You can run the diagnostics script to check your QStash environment configuration and connectivity:

```bash
node scripts/qstash-diagnostics.js
```

### NOT VERIFIED — REQUIRES EXTERNAL QSTASH INFRASTRUCTURE
If you see the verdict `NOT VERIFIED — EXTERNAL INFRASTRUCTURE REQUIRED`, it means either you are pointing to a loopback address (`localhost`, `127.0.0.1`) or critical QStash configuration variables are missing or set to dummy "development" values. You need valid cloud QStash credentials to perform full verification.
