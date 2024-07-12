import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '../models/user.js';
/**
 * Generates a JWT token.
 * @param {Object} payload - The payload to include in the token.
 * @param {string} secret - The secret key to sign the token.
 * @param {string} expiresIn - The expiration time for the token.
 * @returns {string} - The generated JWT token.
 */
export const generateToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '32d') => {
    return jwt.sign(payload, secret, { expiresIn });
  };
  

/**
 * Middleware to verify a JWT token.
 * @param {string} secret - The secret key to verify the token.
 * @param {boolean} isBearer - Whether the token is a Bearer token.
 * @returns {Function} - The middleware function.
 */

export const verifyToken =  (secret = process.env.JWT_SECRET, isBearer = false) => {
  return async (req, res, next) => {
      const header = req.headers.authorization || req.headers.token;
      
      if (!header) {
        throw next(new AppError('Authorization header is required', 401));
      }

      const token = isBearer ? header.split(' ')[1] : header;

      if (!token) {
        throw next(new AppError('JWT must be provided', 401));
      }

      try {
          const decoded =  jwt.verify(token, secret);
          req.user = await User.findById(decoded.id);
          next();
      } catch (error) {
          throw next(new AppError('Invalid or expired token', 401));
      }
  };
};
  