# Role-Based Access Control (RBAC) & Authorization — SubPulse

## Permission Architecture
Roles map to arrays of granular permissions defined in `src/config/security.js`:

```javascript
ROLE_PERMISSIONS: {
  user: [
    'subscription:create',
    'subscription:read',
    'subscription:update',
    'subscription:delete',
    'profile:read',
    'profile:update'
  ],
  admin: [
    'subscription:create',
    'subscription:read',
    'subscription:update',
    'subscription:delete',
    'profile:read',
    'profile:update',
    'admin:users',
    'admin:logs',
    'admin:sessions',
    'billing:view'
  ]
}
```

---

## 🛡️ RBAC Middleware Usage
```javascript
import { requireRole, requirePermission } from '../middleware/rbac.middleware.js';

// Restrict endpoint to admin role
router.get('/admin/dashboard', authMiddleware, requireRole('admin'), handler);

// Restrict endpoint to specific permission
router.delete('/admin/logs', authMiddleware, requirePermission('admin:logs'), handler);
```
