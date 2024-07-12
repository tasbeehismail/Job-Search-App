import User from '../models/user.js'
import AppError from '../utils/appError.js';

export const existingUser = async (req, res, next) => {
    const { email, mobileNumber } = req.body;
    const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

    if (user) {
        next(new AppError('User already exists with this email or mobile number', 409));
    } else {
        next();
    }
}