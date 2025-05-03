import { Module } from '@nestjs/common';
import { CompanyAssesmentService } from './company-assesment.service';
import { CompanyAssesmentController } from './company-assesment.controller';

@Module({
  controllers: [CompanyAssesmentController],
  providers: [CompanyAssesmentService],
})
export class CompanyAssesmentModule {}
