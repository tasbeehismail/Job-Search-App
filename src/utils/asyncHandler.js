import AppError from "./appError.js";

export default function asyncHandler(fn) {
    return async (req, res, next) => {
        fn(req, res, next).catch(error => {
            next(new AppError(error, 500));
        });
    };
}