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
    subject: 'Set Your Password',
    text: `Click on the link to set your password: ${process.env.CLIENT_URL}/set-password/${token}`,
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
    subject: 'Password Reset',
    text: `Click on the link to reset your password:http://localhost:3000/reset-password/${token}`,
  };

  await transporter.sendMail(mailOptions);
};
