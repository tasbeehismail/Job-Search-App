import AppError from "../utils/appError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      next(new AppError('You are not authorized to perform this action', 403));
    }
  };
};