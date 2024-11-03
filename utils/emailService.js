const nodemailer = require('nodemailer');

// Send invitation email with link to set password
exports.sendInvitationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Correct user
      pass: process.env.EMAIL_PASS, // Use correct pass
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Set Your Password12',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2>Welcome to Our Platform</h2>
      <p>Click the button below to set your password:</p>
      <div style="text-align: center; margin: 20px;">
        <a href="${process.env.CLIENT_URL}/setpassword?token=${token}" 
           style="padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">
          Set Password
        </a>
      </div>
    </div>
  `,
  };


  await transporter.sendMail(mailOptions);
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Set Your Password',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="text-align: center; color: #4CAF50;">Welcome to Your Company!</h2>
      <p>Hi there,</p>
      <p>To get started, please set up your password by clicking the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.CLIENT_URL}/set-password/${token}" style="display: inline-block; padding: 12px 24px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Set Password
        </a>
      </div>
      <p>If you did not request this, please disregard this email.</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 12px; color: #888;">If you have any questions, feel free to contact our support team at support@yourcompany.com.</p>
      <p style="text-align: center; font-size: 12px; color: #aaa;">&copy; 2023 Your Company. All rights reserved.</p>
    </div>
  `,
  };
  await transporter.sendMail(mailOptions);
};
