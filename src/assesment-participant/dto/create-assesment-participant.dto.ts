import { IsEnum, IsOptional, IsString } from "class-validator";
import { AssessmentIntentStatus } from "../entities/assesment-participant.entity";

export class CreateAssesmentParticipantDto {

    @IsString()
    assessmentId: string;

    @IsString()
    @IsOptional()
    userId: string;


}
