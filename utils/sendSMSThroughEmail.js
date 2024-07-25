const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendOTPEmail(emailAddress, code) {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email username
      pass: process.env.EMAIL_PASSWORD  // Your email password
    }
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender's email address
    to: emailAddress,                // Recipient's email address
    subject: 'Your OTP Code',        // Email subject
    text: `Your verification code is ${code}` // Email body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully to:', emailAddress);
  } catch (error) {
    console.error('Error sending OTP:', error.response || error.message || error);
    throw error; // Rethrow the error to be handled in the route
  }
}

module.exports = sendOTPEmail;
