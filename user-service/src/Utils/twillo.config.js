
 
const twilio = require("twilio"); 
const client =twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILLO_AUTH_TOKEN);
  

  
  const sendOtpToClient = async (phoneNumber) => {
    try {
      // Format the number to E.164 format
      const formattedNumber = phoneNumber
  
      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(process.env.TWILIO_PHONE_NUMBER);
      // Send the OTP via Twilio
      const message = await client.messages.create({
        body: `Your OTP for login In HrAutomail Is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER , // Twilio-approved Sender ID
        to: formattedNumber,
      });
  
      console.log('OTP sent successfully:', message.sid);
      return otp;
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      throw error;
    }
  };
  
  module.exports = {
    sendOtpToClient,
  };
  