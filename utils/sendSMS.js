const twilio = require('twilio');

// Directly include Twilio credentials (replace these with your actual credentials)
const TWILIO_ACCOUNT_SID = '';
const TWILIO_AUTH_TOKEN = '';
const TWILIO_PHONE_NUMBER = '';

// Log Twilio credentials to verify they're used correctly
console.log('Twilio Account SID:', TWILIO_ACCOUNT_SID);
console.log('Twilio Auth Token:', TWILIO_AUTH_TOKEN);

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendSMS(to, body) {
  try {
    await client.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to
    });
    console.log('SMS sent successfully'); // Log success message
  } catch (error) {
    console.error('Error sending SMS:', error.message); // Log detailed error
    throw new Error('Failed to send SMS');
  }
}

module.exports = sendSMS;
