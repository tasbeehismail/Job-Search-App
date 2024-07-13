import AppError from "../utils/appError.js";

/**
 * Middleware to authorize users based on their role.
 * @param {...string[]} allowedRoles - Roles that are allowed to access the protected route.
 * @returns {function(req, res, next): void} - Middleware function.
 */
export const authorizeRoles = (...allowedRoles) => {
  /**
   * Checks if the user's role is allowed to access the protected route.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {function} next - The next middleware function.
   * @returns {void}
   */
  return (req, res, next) => {
    const user = req.user;

    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      next(new AppError('You are not authorized to perform this action', 403));
    }
  };
};
