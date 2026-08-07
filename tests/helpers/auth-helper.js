import jwt from 'jsonwebtoken';

export const generateTestToken = (
  userId = '507f1f77bcf86cd799439011',
  email = 'test@example.com'
) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET || 'test-jwt-secret-key-12345', {
    expiresIn: '1d'
  });
};
