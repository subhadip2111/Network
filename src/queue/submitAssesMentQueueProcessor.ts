import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from 'src/email/email.service';

@Processor('submit-assessment-email-queue')
export class submitAssesMentQueueProcessor {
    constructor(private readonly emailService: EmailService) { }

    @Process('send-assessment-submission-email')
    async handleAssessmentEmail(job: Job) {
        const { to,userName, companyName} = job.data;
        await this.emailService.sendAssessmentSubmissionEmail(  to,  userName || 'Participant',companyName
        );
        console.log(`submission  email sent to ${to} for ${companyName}`);
    }
}
