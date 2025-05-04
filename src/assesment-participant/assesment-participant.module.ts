import { Module } from '@nestjs/common';
import { AssesmentParticipantService } from './assesment-participant.service';
import { AssesmentParticipantController } from './assesment-participant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentParticipant } from './entities/assesment-participant.entity';
import { QueueModule } from 'src/queue/queue.module';
import { CompanyAssesmentModule } from 'src/company-assesment/company-assesment.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentParticipant]),QueueModule,CompanyAssesmentModule,CloudinaryModule],
  controllers: [AssesmentParticipantController],
  providers: [AssesmentParticipantService],
  exports: [AssesmentParticipantService],
})
export class AssesmentParticipantModule {}
