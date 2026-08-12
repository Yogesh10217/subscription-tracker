# SubPulse Graceful Shutdown Architecture

## Overview
SubPulse implements a centralized, idempotent shutdown manager (`src/config/shutdown.js`) ensuring zero dropped HTTP connections, safe cron task cancellation, and clean MongoDB connection teardown upon container termination or process signals.

---

## Shutdown Trigger Signal Flow

```
OS Signal (SIGTERM / SIGINT) / Process Error (unhandledRejection / uncaughtException)
                          │
                          ▼
            [ shutdown.js Manager ]
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
 [ 10s Graceful Period ]      [ 15s Force Kill Safety Net ]
          │
          ├─► 1. Stop node-cron scheduler (cronTask.stop())
          ├─► 2. Close HTTP Server (server.close()) — stop accepting new connections
          ├─► 3. Drain in-flight HTTP requests (up to 10s)
          ├─► 4. Close MongoDB Connection (mongoose.connection.close())
          │
          ▼
   process.exit(0)
```

---

## Signal Supervision & PID 1
Inside Docker containers, Node.js runs under `tini` as PID 1 (`ENTRYPOINT ["/sbin/tini", "--"]`). `tini` correctly forwards OS `SIGTERM` and `SIGINT` signals to the Node process.

---

## Idempotency & Safety
- **Duplicate Signal Guard**: If `SIGTERM` is received while a shutdown is already in progress, the second signal is safely ignored.
- **Absolute Timeout Guard**: Unref'd `setTimeout(15000)` force kills the process with code 1 if HTTP connection draining hangs.
- **Process Errors**: `unhandledRejection` and `uncaughtException` log structured diagnostic traces before triggering orderly shutdown (never continue operating in an undefined state).
