import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import userRepository from '../repositories/user.repository.js';
import ApiError from '../utils/api-error.js';

export const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && (req.cookies.accessToken || req.cookies.token)) {
      token = req.cookies.accessToken || req.cookies.token;
    }

    if (!token) {
      return next(ApiError.unauthorized('Unauthorized: Token missing'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findByIdRaw(decoded.userId);

    if (!user) {
      return next(ApiError.unauthorized('Unauthorized: User no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(ApiError.unauthorized(`Unauthorized: ${error.message}`));
  }
};

export default authMiddleware;
