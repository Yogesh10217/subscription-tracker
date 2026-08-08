# Notification Architecture Guide — SubPulse

## Subsystem Boundary (`src/notifications/`)
SubPulse Notification & Reminder Platform operates as an asynchronous, idempotent, and retryable bounded subsystem isolated inside `src/notifications/`.

---

## 🧜‍♀️ Mermaid Architecture Diagrams

### 1. Notification Lifecycle State Diagram
```mermaid
stateDiagram-v2
    [*] --> PENDING
    PENDING --> SCHEDULED: Evaluated & Saved
    SCHEDULED --> PROCESSING: Worker Triggered
    PROCESSING --> SENT: Email Accepted by SMTP
    PROCESSING --> DELIVERED: In-App Created
    PROCESSING --> RETRYING: Transient Failure
    RETRYING --> PROCESSING: Exponential Backoff
    PROCESSING --> FAILED: Permanent Failure / Max Retries
```

### 2. Renewal Reminder Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    participant Scheduler as Scheduler Service
    participant Engine as Reminder Engine
    participant DB as MongoDB
    participant Worker as Notification Worker
    participant Provider as Email Provider

    Scheduler->>Engine: evaluateRenewals()
    Engine->>DB: Query Active ReminderRules
    Engine->>Engine: Generate SHA-256 Idempotency Key
    Engine->>DB: Atomic insert (SCHEDULED)
    Note over Engine,DB: E11000 duplicate key error ignored gracefully
    Scheduler->>Worker: processJob({ notificationId })
    Worker->>DB: Status -> PROCESSING
    Worker->>Provider: send({ recipient, subject, html })
    Provider-->>Worker: { success: true, messageId }
    Worker->>DB: Status -> SENT (sentAt = Date)
```

### 3. Trial Expiration Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    participant Engine as Reminder Engine
    participant DB as MongoDB
    
    Engine->>DB: Query Active Trials
    Engine->>Engine: Check Preferences & Quiet Hours
    Engine->>DB: Atomic insert (DELIVERED for In-App)
```

### 4. Async Worker Flow
```mermaid
sequenceDiagram
    autonumber
    participant QStash as QStash Receiver
    participant Controller as Worker Controller
    participant Worker as Notification Worker
    
    QStash->>Controller: POST /api/v1/notifications/worker
    Controller->>Controller: Verify QStash Signature
    Controller->>Worker: processJob(payload)
```

### 5. Retry Flow
```mermaid
sequenceDiagram
    autonumber
    participant Worker as Notification Worker
    participant Classifier as Failure Classifier
    participant DB as MongoDB
    
    Worker->>Worker: Attempt Delivery
    Worker-->>Classifier: Delivery Error
    alt Permanent Error or Max Retries Exceeded
        Classifier-->>Worker: PERMANENT
        Worker->>DB: Status -> FAILED
    else Transient Error
        Classifier-->>Worker: TRANSIENT
        Worker->>DB: Status -> RETRYING (retryCount++)
    end
```
