import { PartialType } from '@nestjs/swagger';
import { CreateCompanyAssessmentDto } from './create-company-assesment.dto';

export class UpdateCompanyAssesmentDto extends PartialType(CreateCompanyAssessmentDto) {}
