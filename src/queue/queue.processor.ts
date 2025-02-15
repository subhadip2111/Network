import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';

@Processor('email-queue')
export class QueueProcessor {
  @Process('send-email')
  async handleEmailJob(job: Job<{ email: string; name: string }>) {
    console.log(`Processing email for ${job.data.email}`);

    // Simulate email sending logic
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Email sent successfully to ${job.data.email}`);
  }
}
