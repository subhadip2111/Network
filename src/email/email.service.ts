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
  
}
