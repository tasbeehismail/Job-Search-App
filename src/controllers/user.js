import User from '../models/user.js';
import Company from '../models/company.js';
import Job from '../models/job.js';
import Application from '../models/application.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../services/auth.service.js';
import AppError from '../utils/appError.js';
import { sendOTP, verifyOTP as verify } from '../services/otp.service.js';
import resetPasswordEmailTemplate from '../view/resetPasswordEmail.js';
import verifyEmailTemplate from '../view/verifyEmail.js';
/**
 * @description Signup a new user
 * @route POST /user/signup
 * @access Public
 * @param {object} req - Express request object containing user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const signup = async (req, res, next) => {
    // Hash the password
    let { password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10);
    req.body.password = hashedPassword;
    // Create a new user
    const user = new User({ ...req.body });
    await user.save();
    // Send OTP for email verification
    await sendOTP(user, 'Email Verification', verifyEmailTemplate);
    // Remove sensitive data before sending response
    user.password = undefined;
    user.otp = undefined;

    res.status(201).json({ message: 'User created successfully. Verification email sent.', data: user });
}
/**
 * @description Login a user
 * @route POST /user/login
 * @access Public
 * @param {object} req - Express request object containing login details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const login = async (req, res, next) => { 
    const  {loginField, password} = req.body;
    // Find user by email, recovery email, or mobile number
    let user = await User.findOne({
        $or: [
            { email: loginField },
            { recoveryEmail: loginField },
            { mobileNumber: loginField }
        ],
    });
    // Check if user exists and password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return next(new AppError('Invalid login credentials', 401));
    }
    // Check if email is verified
    if (!user.confirmEmail) {
        return next(new AppError('Email not verified. Please verify your email first.', 401));
    }
    // Generate a token
    const payload = { id: user._id, email: user.email, role: user.role, tokenType: 'access' };
    const token = generateToken(payload);
    // Update user status to online
    user.status = 'online';
    await user.save();

    return res.status(200).json({ message: 'User logged in successfully', Token: token });
}
/**
 * @description Verify user's email
 * @route POST /user/verify-email
 * @access Public
 * @param {object} req - Express request object containing email and OTP
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const verifyEmail = async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
       return next(new AppError('Invalid email', 404));
    }
    // Check if OTP is valid
    const result = await verify(user, otp);
    if (!result.success) {
        return next(new AppError(result.message, 400));
    }
    // Update email confirmation status
    user.confirmEmail = true;
    await user.save();

    res.status(200).json({ message: result.message });
};
/**
 * @description Request password reset
 * @route POST /user/forgot-password
 * @access Public
 * @param {object} req - Express request object containing user's email
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Send OTP for password reset
    await sendOTP(user, 'Password Reset Request', resetPasswordEmailTemplate);

    res.status(200).json({ message: 'Password reset email sent' });
}
/**
 * @description Reset user's password
 * @route POST /user/reset-password
 * @param {object} req - Express request object containing new password, OTP, and email
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const resetPassword = async (req, res, next) => {
    const { newPassword, otp, email } = req.body;
    const user = await User.findOne({ email });
    // Check if user exists
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
/**
 * @description Get current logged-in user's details
 * @route GET /user/me
 * @access Private
 * @param {object} req - Express request object containing user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getMe = async (req, res, next) => {
    const user = req.user;
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
    // Remove sensitive data before sending response
    user.password = undefined;
    user.otp = undefined;

    res.status(200).json({ data: user });
}
/**
+ * @description Get other user's profile
+ * @route GET /user/account/:id
+ * @access Private
+ * @param {object} req - Express request object containing user ID
+ * @param {object} res - Express response object
+ * @param {function} next - Express next middleware function
+ */
export const getOtherUser = async (req, res, next) => {
    const { id } = req.params;
    // Exclude password, otp, and confirmEmail from response
    const user = await User.findById(id).select('-password -otp -confirmEmail');  
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({ data: user });
}
/**
 * @description Get accounts by recovery email
 * @route GET /user/accounts
 * @access Private
 * @param {object} req - Express request object containing recovery email
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getAccountsByRecoveryEmail = async (req, res, next) => {
    const { recoveryEmail } = req.body;
    // Exclude password, otp, and confirmEmail from response
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
/**
 * @description Update current user's account details
 * @route PATCH /user/account
 * @access Private
 * @param {object} req - Express request object containing updated user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const updateAccount = async (req, res, next) => {
    const { email, mobileNumber, recoveryEmail, firstName, lastName, DOB } = req.body;
    const user = req.user;
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
    // Update user details
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.recoveryEmail = recoveryEmail || user.recoveryEmail;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.DOB = DOB || user.DOB;
    await user.save();
    // Remove sensitive data before sending response
    user.password = undefined;
    user.otp = undefined;

    res.status(200).json({ data: user });
}
/**
 * @description Delete current user's account
 * @route DELETE /user/account
 * @access Private
 * @param {object} req - Express request object containing user details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const deleteAccount = async (req, res, next) => {
    const userId = req.user._id;
    if(!userId){
        return next(new AppError('User not found', 404));
    }

    // Delete all applications related to this user
    await Application.deleteMany({ userId: userId });

    // If the user is a company HR, delete related jobs and handle the company
    if (req.user.role === 'Company_HR') {
      // Find the company associated with this HR
      const company = await Company.findOne({ companyHR: userId });

      if (company) {
        const companyId = company._id;

        // Delete all jobs related to this company
        const jobs = await Job.find({ companyId: companyId });
        const jobIds = jobs.map(job => job._id);

        await Job.deleteMany({ companyId: companyId });

        // Delete all applications related to these jobs
        await Application.deleteMany({ jobId: { $in: jobIds } });

        // Finally, delete the company
        await Company.findByIdAndDelete(companyId);
      }
    }

    // Finally, delete the user
    await User.findByIdAndDelete(userId);
    res.status(200).json({
        message: 'User account and related documents deleted successfully',
    });
}

/**
 * @description Update the current user's password
 * @route PATCH /user/password
 * @access Private
 * @param {object} req - Express request object containing current and new passwords
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    // Check if user exists
    if(!user){
        return next(new AppError('User not found', 404));
    }
   // Verify if current password matches the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if(!isMatch){
        return next(new AppError('Current password is incorrect', 400));
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
}
