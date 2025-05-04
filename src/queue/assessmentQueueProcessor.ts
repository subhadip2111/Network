import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';

@Processor('assessment-email-queue')
export class AssessmentQueueProcessor {
  constructor(private readonly emailService: EmailService) { }

  @Process('send-assessment-email')
  async handleAssessmentEmail(job: Job) {
    const { userName, assessmentLink, startTime, companyName, to } = job.data;
    await this.emailService.sendAssessmentRegistrationEmail(
      to,
      userName || 'Participant',
      assessmentLink,
      startTime,
      companyName,
    );
    console.log(`Assessment email sent to ${to} for ${companyName}`);
  }
}
