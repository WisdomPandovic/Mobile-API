const sendSMSThroughEmail = require('./utils/sendSMSThroughEmail');

// Example usage
const phoneNumber = ''; // Replace with a valid phone number
const carrierGateway = 'tmomail.net'; // For T-Mobile users
const code = '1234'; // Example verification code

sendSMSThroughEmail(phoneNumber, carrierGateway, code)
  .then(() => console.log('SMS sent successfully'))
  .catch(error => console.error('Failed to send SMS:', error));
