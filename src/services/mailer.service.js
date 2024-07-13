import nodemailer from "nodemailer";
import AppError from '../utils/appError.js';

const sendEmail = async (to, subject, htmlContent) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: "gmail", 
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS,
            },
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Job Search App" <${process.env.MAILER_USER}>`,
            to,
            subject,
            html: htmlContent,
        });

       //console.log("Message sent: %s", info.messageId); 
    } catch (error) {
        throw new AppError('Error sending email', 500);
    }
};

export default sendEmail;