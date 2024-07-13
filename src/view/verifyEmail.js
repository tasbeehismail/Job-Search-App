/**
 * Email verification template for sending OTP to users
 * @param {string} fullName - Full name of the user
 * @param {string} otp - One-Time Password (OTP) for verification
 * @returns {string} Email verification template
 */
const verifyEmailTemplate = (fullName, otp) => {
    const verifyUrl = `${process.env.BASE_URL}/user/verify-email`;
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                /* Style for the email verification template */
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                }
                p {
                    color: #666;
                    margin-bottom: 20px;
                }
                .otp {
                    display: inline-block;
                    font-size: 24px;
                    font-weight: bold;
                    padding: 10px 20px;
                    background-color: #f0f0f0;
                    border-radius: 4px;
                    color: #333;
                    margin-bottom: 20px;
                }
                a {
                    display: inline-block;
                    background-color: #333;
                    color: #fff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-size: 16px;
                }
                a:hover {
                    background-color: #666;
                }
                .footer {
                    margin-top: 20px;
                    color: #777;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Email Verification</h1>
                <p>Hello ${fullName},</p>
                <p>Your One-Time Password (OTP) for verification is:</p>
                <div class="otp">${otp}</div>
                <p>Please use this OTP to complete your verification process. Do not share this OTP with anyone.</p>
                <p>Alternatively, you can click the link below to verify your email:</p>
                <a href="${verifyUrl}" clicktracking="off">Verify Email</a>
                <p>If you did not request this OTP, please ignore this email.</p>
                <p>Thank you!</p>
                <div class="footer">
                    <p>&copy; 2024 Route. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export default verifyEmailTemplate;