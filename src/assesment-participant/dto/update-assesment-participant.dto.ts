import { PartialType } from '@nestjs/swagger';
import { CreateAssesmentParticipantDto } from './create-assesment-participant.dto';
import { IsEnum, IsNotEmpty, isNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { AssessmentIntentStatus } from '../entities/assesment-participant.entity';

export class UpdateAssesmentParticipantDto {
    @IsNotEmpty()
    @IsUrl()
    submissionLink: string;

    @IsOptional()
    @IsEnum(AssessmentIntentStatus)
    status: string;

    @IsOptional()
    submittedAt: string;

}
