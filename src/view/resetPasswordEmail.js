/**
 * Returns an HTML email template for resetting a user's password.
 * @param {string} fullName - The full name of the user.
 * @param {string} otp - The one-time password for password reset.
 * @returns {string} An HTML email template.
 */
const resetPasswordEmailTemplate = (fullName, otp) => {
    // Construct the reset URL with the base URL from the environment variables.
    const resetUrl = `${process.env.BASE_URL}/user/reset-password`;

    // Return the HTML email template.
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">

          <!-- Set the title of the email -->
          <title>Password Reset</title>

          <!-- Define the styles for the email -->
          <style>
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
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Password Reset Request</h1>
              <p>Hi ${fullName},</p>
              <p>You requested to reset your password. Please click the link below to set a new password and use the OTP provided:</p>
              <a href="${resetUrl}" clicktracking="off">Reset Password</a>
              <p>Your OTP is: <strong>${otp}</strong></p>
              <p>If you did not request this, please ignore this email.</p>
          </div>
      </body>
      </html>
    `;
};

export default resetPasswordEmailTemplate;