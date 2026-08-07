import ApiError from '../utils/api-error.js';
import SECURITY_CONFIG from '../config/security.js';

/**
 * Middleware enforcing specific user role (e.g. 'admin').
 * @param {string} role
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (req.user.role !== role) {
      return next(ApiError.forbidden(`Access denied: Requires ${role} role`));
    }

    next();
  };
};

/**
 * Middleware enforcing granular permission requirement (e.g. 'admin:logs').
 * @param {string} permission
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const userRole = req.user.role || 'user';
    const rolePerms = SECURITY_CONFIG.ROLE_PERMISSIONS[userRole] || [];
    const userPerms = [...rolePerms, ...(req.user.permissions || [])];

    if (!userPerms.includes(permission)) {
      return next(ApiError.forbidden(`Access denied: Missing permission '${permission}'`));
    }

    next();
  };
};

export default { requireRole, requirePermission };
