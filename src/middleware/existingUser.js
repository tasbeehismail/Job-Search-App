import User from '../models/user.js'
import AppError from '../utils/appError.js';

/**
 * Middleware to check if a user with the given email or mobile number already exists
 * If a user exists, an AppError is thrown with a 409 status code
 * If no user exists, the middleware calls the next middleware function in the stack
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 * @throws {AppError} If a user with the given email or mobile number already exists.
 */
export const existingUser = async (req, res, next) => {
    // Destructure the email and mobileNumber from the request body
    const { email, mobileNumber } = req.body;

    // Find a user with the given email or mobileNumber
    const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    // If a user exists, throw an AppError
    if (user) {
        next(new AppError('User already exists with this email or mobile number', 409));
    } else {
        // If no user exists, call the next middleware function
        next();
    }
}
