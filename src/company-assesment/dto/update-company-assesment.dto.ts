import { PartialType } from '@nestjs/swagger';
import { CreateCompanyAssesmentDto } from './create-company-assesment.dto';

export class UpdateCompanyAssesmentDto extends PartialType(CreateCompanyAssesmentDto) {}
