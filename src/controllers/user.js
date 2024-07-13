import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import { sendOTP, verifyOTP as verify } from '../services/otp.service.js';
import resetPasswordEmailTemplate from '../view/resetPasswordEmail.js';
import verifyEmailTemplate from '../view/verifyEmail.js';

export const signup = async (req, res, next) => {
    let { password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10);
    req.body.password = hashedPassword;

    const user = new User({ ...req.body });
    await user.save();
    
    await sendOTP(user, 'Email Verification', verifyEmailTemplate);

    user.password = undefined;
    user.otp = undefined;

    res.status(201).json({ message: 'User created successfully. Verification email sent.', data: user });
}

export const login = async (req, res, next) => { 
    const  {loginField, password} = req.body;
    let user = await User.findOne({
        $or: [
            { email: loginField },
            { recoveryEmail: loginField },
            { mobileNumber: loginField }
        ],
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError('Invalid login credentials', 401));
    }
    if (!user.confirmEmail) {
        return next(new AppError('Email not verified. Please verify your email first.', 401));
    }

    const payload = { id: user._id, email: user.email, role: user.role, tokenType: 'access' };
    const token = generateToken(payload);

    user.status = 'online';
    await user.save();

    return res.status(200).json({ message: 'User logged in successfully', Token: token });
}

export const verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
       return next(new AppError('Invalid email', 404));
    }
    // Check if OTP is valid
    const result = await verify(user, otp);
    if (!result.success) {
        return next(new AppError(result.message, 400));
    }
    user.confirmEmail = true;
    await user.save();

    res.status(200).json({ message: result.message });
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await sendOTP(user, 'Password Reset Request', resetPasswordEmailTemplate);

    res.status(200).json({ message: 'Password reset email sent' });
}

export const resetPassword = async (req, res, next) => {
    const { newPassword, otp, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if OTP is valid
    const result = await verify(user, otp);
    if (!result.success) {
        return next(new AppError(result.message, 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
}

export const getMe = async (req, res, next) => {
    const user = req.user;
    if(!user){
        return next(new AppError('User not found', 404));
    }

    user.password = undefined;
    user.otp = undefined;
    res.status(200).json({ data: user });
}

export const getOtherUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -otp -confirmEmail');
    if(!user){
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ data: user });
}

export const getAccountsByRecoveryEmail = async (req, res, next) => {
    const { recoveryEmail } = req.body;
    const users = await User.find({ recoveryEmail }).select('-password -otp -confirmEmail');

    if (!users.length) {
        return next(new AppError('No accounts found with the provided recovery email', 404));
    }

    res.status(200).json({
        results: users.length,
        data: {
            users
        }
    });
}

export const updateAccount = async (req, res, next) => {
    const { email, mobileNumber, recoveryEmail, firstName, lastName, DOB } = req.body;
    const user = req.user;
    if(!user){
        return next(new AppError('User not found', 404));
    }
    
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.recoveryEmail = recoveryEmail || user.recoveryEmail;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.DOB = DOB || user.DOB;
    await user.save();

    user.password = undefined;
    user.otp = undefined;

    res.status(200).json({ data: user });
}

export const deleteAccount = async (req, res, next) => {
    const user = req.user;
    if(!user){
        return next(new AppError('User not found', 404));
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({
        message: 'User account has been deleted successfully',
    });
}

export const updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    console.log(user);
    if(!user){
        return next(new AppError('User not found', 404));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch){
        return next(new AppError('Current password is incorrect', 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
}
