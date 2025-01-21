const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendOtpToClient = async (phoneNumber) => {
  try {
    const formattedNumber = phoneNumber;

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(process.env.TWILIO_PHONE_NUMBER);
    // Send the OTP via Twilio
    const message = await client.messages
      .create({
        body: `Your Login OTP IN Network Is : ${otp}`,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
        to: `${formattedNumber}`,
      })
      .then((message) => console.log(message));

    return otp;
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    throw error;
  }
};

module.exports = {
  sendOtpToClient,
};

// Your AccountSID and Auth Token from console.twilio.com
// const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// const authToken = 'your_auth_token';

// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//     body: 'Hello from twilio-node',
//     to: '+12345678901', // Text your number
//     from: '+12345678901', // From a valid Twilio number
//   })
//   .then((message) => console.log(message.sid));
