# Folder Structure Reference

```
subscription-tracker/
├── app.js                         # Root entry point delegating to src/app.js
├── package.json
├── public/                        # Static web frontend (SubPulse UI)
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
└── src/
    ├── app.js                     # Express middleware pipeline assembly
    ├── server.js                  # HTTP server & graceful shutdown listener
    ├── config/                    # Environment & integration configuration
    │   ├── env.js                 # Centralized environment variable validation
    │   ├── database.js            # MongoDB connection manager with retries
    │   ├── arcjet.js              # Arcjet bot/rate-limit guard
    │   ├── upstash.js             # Upstash QStash workflow client
    │   └── nodemailer.js          # Nodemailer SMTP transporter
    ├── constants/                 # Immutable application constants
    │   ├── http-status.js
    │   ├── roles.js
    │   ├── app.js
    │   ├── subscription-status.js
    │   └── payment-frequency.js
    ├── repositories/              # Database data access layer
    │   ├── user.repository.js
    │   └── subscription.repository.js
    ├── services/                  # Framework-independent business logic
    │   ├── auth.service.js
    │   ├── user.service.js
    │   ├── subscription.service.js
    │   ├── workflow.service.js
    │   └── email.service.js
    ├── controllers/               # Thin HTTP handlers
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── subscription.controller.js
    │   └── workflow.controller.js
    ├── validators/                # Request validation schemas
    │   ├── auth.validator.js
    │   ├── subscription.validator.js
    │   └── user.validator.js
    ├── middleware/                # Express middleware functions
    │   ├── request-id.middleware.js
    │   ├── arcjet.middleware.js
    │   ├── auth.middleware.js
    │   └── error.middleware.js
    ├── routes/                    # API & Health route definitions
    │   ├── health.routes.js       # /health, /ready, /live
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── subscription.routes.js
    │   └── workflow.routes.js
    ├── models/                    # Mongoose schemas & ODM definitions
    │   ├── user.model.js
    │   └── subscription.model.js
    ├── utils/                     # Utility functions & helpers
    │   ├── logger.js              # Centralized logger
    │   ├── api-error.js           # Custom ApiError hierarchy
    │   ├── async-handler.js       # Async wrapper
    │   ├── api-response.js        # Response wrapper
    │   └── send-email.js          # Email sender helper
    ├── templates/                 # Email templates
    │   └── email.template.js
    ├── jobs/                      # Background scheduled tasks
    └── docs/                      # Technical documentation
        ├── Architecture.md
        ├── FolderStructure.md
        └── RefactorSummary.md
```
