const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.NODE_MAILER_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});


async function sendCompanyWelcomeEmail(email, recipientCompanyName) {
    console.log('Sending welcome email to:', email);
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.PLATFORM_NAME}" <${process.env.NODE_MAILER_USER}>`, 
            to: email, // Recipient email address
            subject: `Welcome to ${process.env.PLATFORM_NAME}, ${recipientCompanyName}!`, 
            text: `Hello ${recipientCompanyName},\n\nWelcome to ${process.env.PLATFORM_NAME}! We’re excited to partner with you.`, 
            html: `
                <p>Hello ${recipientCompanyName},</p>
                <p>Welcome to <strong>${process.env.PLATFORM_NAME}</strong>! We’re excited to partner with you and look forward to a successful journey together.</p>
                <p>Our platform is designed to help you grow and achieve your company’s goals. If you have any questions, feel free to reach out to our support team anytime.</p>
                <p>Best regards,<br>${process.env.PLATFORM_NAME} Team</p>
                <br>
                    <img src="${process.env.LOGO_URL}" alt="${process.env.PLATFORM_NAME} Logo" style="width: 200px; height: auto;" />
            `, 
        
        });

        console.log('Welcome email sent successfully:', info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
        return { success: false, error: error.message };
    }
}

async function sendCompanyPasswordResetEmail(email, recipientCompanyName, otp) {
    console.log('Sending password reset email to:', email);
    try {
      const info = await transporter.sendMail({
        from: `"${process.env.PLATFORM_NAME}" <${process.env.NODE_MAILER_USER}>`,
        to: email,
        subject: `Your OTP for Password Reset - ${process.env.PLATFORM_NAME}`,
        text: `Hello ${recipientCompanyName},\n\nWe received a request to reset your password for your account on ${process.env.PLATFORM_NAME}. Please use the following One-Time Password (OTP) to reset your password:\n\n${otp}\n\nThis OTP is valid for ${process.env.OTP_EXPIRY_TIME} minutes.\n\nIf you did not request this change, you can safely ignore this email.\n\nBest regards,\n${process.env.PLATFORM_NAME} Team`,
        html: `
          <p>Hello <strong>${recipientCompanyName}</strong>,</p>
          <p>We received a request to reset your password for your account on <strong>${process.env.PLATFORM_NAME}</strong>.</p>
          <p>Please use the following One-Time Password (OTP) to reset your password:</p>
          <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">${otp}</p>
          <p>This OTP is valid for <strong>${process.env.OTP_EXPIRY_TIME} minutes</strong>.</p>
          <p>If you did not request this change, you can safely ignore this email.</p>
          <br>
          <p>Best regards,<br>The <strong>${process.env.PLATFORM_NAME}</strong> Team</p>
          <br>
          <p style="text-align: center;">
            <img src="${process.env.LOGO_URL}" alt="${process.env.PLATFORM_NAME} Logo" style="width: 150px; height: auto;" />
          </p>
        `,
      });
  
      console.log('OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending OTP email:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  async function sendForgotPasswordOTP(email, recipientCompanyName, otp) {
    console.log('Sending forgot password OTP to:', email);
    try {
      const info = await transporter.sendMail({
        from: `"${process.env.PLATFORM_NAME}" <${process.env.NODE_MAILER_USER}>`,
        to: email,
        subject: `Your OTP for Password Reset on ${process.env.PLATFORM_NAME}`,
        text: `Hello ${recipientCompanyName},\n\nWe received a request to reset the password for your account on ${process.env.PLATFORM_NAME}. Use the following One-Time Password (OTP) to reset your password:\n\n${otp}\n\nThis OTP is valid for ${process.env.OTP_EXPIRY_TIME} minutes. Please do not share it with anyone.\n\nIf you did not request this, please ignore this email or contact our support team.\n\nBest regards,\n${process.env.PLATFORM_NAME} Team`,
        html: `
          <p>Hello <strong>${recipientCompanyName}</strong>,</p>
          <p>We received a request to reset the password for your account on <strong>${process.env.PLATFORM_NAME}</strong>.</p>
          <p>Use the following One-Time Password (OTP) to reset your password:</p>
          <h2 style="text-align: center; color: #007BFF;">${otp}</h2>
          <p>This OTP is valid for <strong>${process.env.OTP_EXPIRY_TIME} minutes</strong>. Please do not share it with anyone.</p>
          <p>If you did not request this, please ignore this email or contact our support team.</p>
          <br>
          <p>Best regards,<br>The <strong>${process.env.PLATFORM_NAME}</strong> Team</p>
          <br>
          <p style="text-align: center;">
            <img src="${process.env.LOGO_URL}" alt="${process.env.PLATFORM_NAME} Logo" style="width: 150px; height: auto;" />
          </p>
        `,
      });
  
      console.log('Forgot password OTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending forgot password OTP email:', error.message);
      return { success: false, error: error.message };
    }
  }
  

  async function sendDeveloperEmailForNewAssessmentSharedByCompany(developerEmail, companyName, projectTitle, projectDescription, repositoryLink, submissionDeadline, companyEmail,hiringTeamsArray) {
  
    try {
      const mailOptions = {
        from: `${companyEmail}`, 
        to: developerEmail,
        subject: `New Assessment: ${projectTitle} Shared by ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Exciting New Assessment Opportunity Awaits!</h2>
            <p>Dear Developer,</p>
            <p>${companyName} has shared an exciting new assessment that aligns with the role you're interested in. Here are the details:</p>
            <ul>
              <li><strong>Project Title:</strong> ${projectTitle}</li>
              <li><strong>Project Description:</strong> ${projectDescription}</li>
              <li><strong>Repository Link:</strong> <a href="${repositoryLink}" target="_blank">${repositoryLink}</a></li>
              <li><strong>Submission Deadline:</strong> ${new Date(submissionDeadline).toLocaleString()}</li>
            </ul>
            <p>
              This project is not just an assessment; it's an opportunity to learn, grow, and showcase your skills in solving real-world challenges. 
            </p>
            <h3 style="color:rgb(44, 204, 50);">A Message for You:</h3>
            <p>
              Remember, success isn’t defined by a single outcome. Even if you find this task challenging, it's an opportunity to learn, improve, and move forward. 
              Take this project as a step to build something unique and grow your capabilities. If you don’t succeed this time, don’t worry—what truly matters is your willingness to keep trying and learning. 
            </p>
            <p style="font-weight: bold;">
              Every attempt, every effort, and every idea you bring to life makes you better than you were yesterday. Keep building, keep experimenting, and never give up!
          
              We’re excited to see your work and wish you the best of luck in this endeavor!
            </p>
            <p style="margin-top: 20px; font-size: 14px; color: #777;">
              Best Regards,<br />
              ${companyName} Hiring Team
            </p>
             
          </div>
        `,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  
  async function sendOtpForlogin(email, otp) {
   

   try {
    
    const mailOptions = {
      from: `"${process.env.PLATFORM_NAME}" <${process.env.NODE_MAILER_USER}>`, // Sender name and email
      to: email, // Receiver email address
      subject: 'OTP for Login', // Email subject
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Your OTP for Login</h2>
          <p>Dear User,</p>
          <p>Your OTP for login is: <strong>${otp}</strong></p>
          <p>Kindly use this OTP to complete your login process.</p>
          <p>Best Regards,<br />
          ${process.env.PLATFORM_NAME} Team</p>
        </div>
      `,
    };
    const info = await transporter.sendMail(mailOptions);

    console.log('OTP sent successfully:', info.messageId);
    return { success: true, message: 'OTP sent successfully' };
   } catch (error) {
     console.error('Error sending email:', error);
    
   }

    // Send the email
  
  
  }
  
module.exports = {  sendCompanyWelcomeEmail,sendCompanyPasswordResetEmail,sendForgotPasswordOTP,sendDeveloperEmailForNewAssessmentSharedByCompany,sendOtpForlogin};
