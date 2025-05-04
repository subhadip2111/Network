
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email-queue') private emailQueue: Queue,
    @InjectQueue('assessment-email-queue') private assessmentEmailQueue: Queue
    , @InjectQueue('submit-assessment-email-queue') private submitAssessmentEmailQueue: Queue
  ) { }


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

  async sendAssessmentEmailJob(to: string, userName: string, assessmentLink: string, startTime: string, companyName: string,): Promise<void> {
    await this.assessmentEmailQueue.add('send-assessment-email', { to, userName, assessmentLink, startTime, companyName, },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: true,
        removeOnFail: false,
        jobId: `assessment-${to}-${Date.now()}`,
      },
    );

    console.log(`Queued assessment email for ${to} at ${startTime}`);
  }

  async sendAssessmentSubmissionEmailJob(
    to: string,
    userName: string,
    companyName: string
  ): Promise<void> {
    await this.submitAssessmentEmailQueue.add(
      'send-assessment-submission-email',
      {
        to,
        userName ,
        companyName,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
        removeOnComplete: true,
        removeOnFail: false,
        jobId: `submission-${to}-${Date.now()}`,
      }
    );

    console.log(`Queued submission email for ${to}`);
  }


}

