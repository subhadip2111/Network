/* eslint-disable prettier/prettier */

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';

@Processor('email-queue')
export class QueueProcessor {


constructor (private readonly emailService: EmailService) {}
  @Process('send-email')
  async handleEmailJob(job: Job<{ email: string; otp:string }>) {
    console.log(`Processing email job for ${job.data.email}...`);
    
    await this.emailService.sendWelcomeEmail(job.data.email,job.data.otp)


    console.log(`Email sent to ${job.data.email}`);
    await job.queue.clean(0, 'completed'); // Clears completed jobs immediately
    await job.queue.clean(0, 'failed'); // Clears failed jobs (optional)
  }
}
