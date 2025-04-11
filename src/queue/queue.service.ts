/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email-queue') private emailQueue: Queue) { }

  // Add a job to send an email
  async sendEmailJob(email: string, otp: string) {
    await this.emailQueue.add('send-email', { email, otp }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
      jobId: `email-${email}`,
    });
    console.log(`Queued email for ${email}`);
    console.log(`Queued email for ${otp}`);

  }
}
/* eslint-disable prettier/prettier */
