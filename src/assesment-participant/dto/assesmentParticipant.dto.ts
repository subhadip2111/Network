import { IsOptional } from "class-validator";

export class queryAssesmentParticipantDto {
    @IsOptional()
    status: string;

    @IsOptional()
    page: number;

    @IsOptional()
    limit: number;

    @IsOptional()
    keyword: string;
    @IsOptional()
    userId: string;
}