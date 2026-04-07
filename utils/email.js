const nodemailer = require('nodemailer');
const customError = require('../helpers/customError');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new customError('Failed to send email', 500);
  }
};

module.exports = sendVerificationEmail;
