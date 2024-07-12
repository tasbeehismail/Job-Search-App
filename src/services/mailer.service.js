import nodemailer from "nodemailer";
import AppError from '../utils/appError.js';

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"Job Search App" <${process.env.MAILER_USER}>`,
            to,
            subject,
            html: htmlContent,
        });

       console.log("Message sent: %s", info.messageId); /// comment this !!!!!!!!!!!!!!!!
    } catch (error) {
        throw new AppError('Error sending email', 500);
    }
};

export default sendEmail;