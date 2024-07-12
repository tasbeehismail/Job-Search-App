import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

export const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '32d') => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (secret = process.env.JWT_SECRET, isBearer = true) => {
  return (req, res, next) => {
      const header = req.headers.authorization || req.headers.token;

      if (!header) {
          return next(new AppError('Authorization header is required', 401));
      }

      const token = isBearer ? header.split(' ')[1] : header;

      if (!token) {
          return next(new AppError('JWT must be provided', 401));
      }

      try {
          const decoded = jwt.verify(token, secret);
          req.user = decoded;
          next();
      } catch (error) {
          return next(new AppError('Invalid or expired token', 401));
      }
  };
};
  