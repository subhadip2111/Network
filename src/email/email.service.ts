import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendWelcomeEmail(to: string, otp: string) {
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="max-width: 600px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); margin: auto;">
          
          <h2 style="color: #333;">Welcome to <span style="color: #4CAF50;">Network</span>! 🚀</h2>
          
          <p style="font-size: 16px; color: #555;">
            We're thrilled to have you join <strong>Network</strong>, the platform where opportunities and connections help you grow.
          </p>
  
          <h3 style="color: #4CAF50; margin-bottom: 10px;">Your One-Time Password (OTP)</h3>
          <p style="font-size: 20px; font-weight: bold; color: #333; padding: 10px; background: #e8f5e9; display: inline-block; border-radius: 5px;">
            ${otp}
          </p>
  
          <p style="color: #777; font-size: 14px; margin-top: 10px;">(This OTP is valid for 10 minutes. Do not share it with anyone.)</p>
  
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
  
          <p style="font-size: 14px; color: #555;">Here’s what you can do next:</p>
          <ul style="text-align: left; margin: 0 auto; padding-left: 20px; color: #444;">
            <li>✅ Complete your profile to let others know about your skills.</li>
            <li>🚀 Start exploring opportunities that match your interests.</li>
            <li>🤝 Connect with like-minded individuals and grow your network.</li>
          </ul>
  
          <p style="color: #777; font-size: 14px; margin-top: 20px;">
            If you ever need assistance, we're here to help!
          </p>
  
          <p style="font-size: 14px; color: #333; font-weight: bold;">Happy Networking!<br>💡 The Network Team</p>
        </div>
      </div>
    `;
  
    await this.mailService.sendMail({
      from: process.env.NODE_MAILER_USER,
      to: to,
      subject: "🎉 Welcome to Network – Your OTP Inside!",
      html: htmlMessage, // Use 'html' instead of 'text' for styled emails
    });
  }
  async sendAssessmentRegistrationEmail(
    to: string,
    userName: string,
    assessmentLink: string,
    startTime: string,
    companyName: string
  ) {
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
          
          <div style="background-color: #004080; padding: 20px;">
            <h2 style="color: #ffffff; margin: 0;">${companyName}</h2>
          </div>
  
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">
              Hi <strong>${userName}</strong>,
            </p>
            <p style="font-size: 16px; color: #333;">
              Thank you for registering for the assessment with <strong>${companyName}</strong>. We're glad to support you on your journey toward new opportunities.
            </p>
  
            <h3 style="color: #004080; margin-top: 30px;">Assessment Details</h3>
            <table style="width: 100%; margin-top: 10px; font-size: 15px; color: #333;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Assessment Link:</td>
                <td><a href="${assessmentLink}" style="color: #007BFF; text-decoration: none;">Click here to join</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Start Time:</td>
                <td>${startTime}</td>
              </tr>
            </table>
  
            <p style="margin-top: 30px; font-size: 15px; color: #555;">
              Please make sure to:
            </p>
            <ul style="padding-left: 20px; color: #555; font-size: 15px;">
              <li>Join the assessment promptly at the scheduled time.</li>
              <li>Ensure your environment is quiet and distraction-free.</li>
              <li>Have a stable internet connection for a smooth experience.</li>
            </ul>
  
            <p style="margin-top: 30px; font-size: 15px; color: #555;">
              Should you have any questions or need assistance, don't hesitate to contact us.
            </p>
  
            <p style="margin-top: 20px; font-size: 15px; color: #333;">
              Best regards,<br>
              The <strong>${companyName}</strong> Team
            </p>
          </div>
  
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 13px; color: #999;">
            &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.
          </div>
  
        </div>
      </div>
    `;
  
    const subject = `You're Registered for the ${companyName} Assessment`;
  
    await this.mailService.sendMail({
      from: process.env.NODE_MAILER_USER,
      to: to,
      subject: subject,
      html: htmlMessage,
    });
  }
  
  
  async sendAssessmentSubmissionEmail(
    to: string,
    userName: string,
    companyName: string
  ) {
    const htmlMessage = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px 20px;">
        <div style="max-width: 640px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); overflow: hidden;">
          
          <div style="background: linear-gradient(90deg, #2563eb, #1e3a8a); padding: 24px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px;">${companyName}</h2>
          </div>
  
          <div style="padding: 32px;">
            <p style="font-size: 18px; color: #111827; margin-bottom: 16px;">
              Hi <strong>${userName}</strong>,
            </p>
  
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Congratulations on submitting your assessment with <strong>${companyName}</strong>! Your commitment, effort, and focus are truly commendable.
            </p>
  
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Whether you felt confident or challenged, what matters most is that you showed up, gave your best, and took a step forward in your journey.
            </p>
  
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Our team is reviewing your submission with care. We'll be back with thoughtful feedback to help you keep learning and growing.
            </p>
  
            <p style="font-size: 16px; color: #1d4ed8; line-height: 1.6; font-weight: 600; margin-top: 20px;">
              Keep your head high — you’re making progress, and that’s powerful.
            </p>
  
            <p style="margin-top: 24px; font-size: 15px; color: #4b5563;">
              Warm wishes,<br>
              The <strong>${companyName}</strong> Team
            </p>
          </div>
  
          <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 13px; color: #9ca3af;">
            &copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.
          </div>
  
        </div>
      </div>
    `;
  
    const subject = `You've Successfully Submitted Your Assessment – ${companyName}`;
  
    await this.mailService.sendMail({
      from: process.env.NODE_MAILER_USER,
      to: to,
      subject: subject,
      html: htmlMessage,
    });
  }
  

  
}
