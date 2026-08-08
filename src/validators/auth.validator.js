import ApiError from '../utils/api-error.js';

export const validateSignUp = (req, res, next) => {
  const { name, email, password } = req.body || {};
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }

  if (errors.length > 0) {
    return next(ApiError.validation('Invalid Sign Up details', errors));
  }

  next();
};

export const validateSignIn = (req, res, next) => {
  const { email, password } = req.body || {};
  const errors = [];

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return next(ApiError.validation('Invalid Sign In details', errors));
  }

  next();
};
