import AppError from "./appError.js";

/**
 * A middleware async function and handles errors.
 * If the async function throws an error, it will be converted to an AppError
 * and passed to the next middleware function.
 *
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} - The wrapped async function.
 */
export default function asyncHandler(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            // If an error is thrown, convert it to an AppError and pass it to the next middleware
            next(new AppError(error, 500));
        }
    };
}
