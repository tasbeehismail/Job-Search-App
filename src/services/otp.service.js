import sendEmail from '../services/mailer.service.js';
import AppError from '../utils/appError.js';
export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a random 4-digit OTP
};

export const sendOTP = async (user, subject, emailTemplate) => {
    const otp = generateOTP();
    // Save OTP in user document
    user.otp = {
        code: otp,
        expiresAt:  Date.now() + 10 * 60 * 1000 // OTP valid for 10 minutes
    }
    await user.save();
    
    const user_fullName = user.firstName + ' ' + user.lastName // Get user full name

    const htmlContent = emailTemplate(user_fullName, otp); // Generate HTML email content

    try {
        // Send OTP email
        await sendEmail(user.email, subject, htmlContent);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        throw new AppError('Error sending OTP email', 500);
    }
};

export const verifyOTP = async (user, otp) => {
    // Check if OTP is valid or expired
    if (user.otp.code !== otp || user.otp.expiresAt < Date.now()) { 
        return { success: false, message: 'Invalid or expired OTP' };
    }
    user.otp = undefined; // Remove OTP from user document
    await user.save(); // Save user document
    return { success: true, message: 'OTP verified successfully' };
};