import { Module } from '@nestjs/common';
import { CompanyAssesmentService } from './company-assesment.service';
import { CompanyAssesmentController } from './company-assesment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyAssessment } from './entities/company-assesment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyAssessment])],
  controllers: [CompanyAssesmentController],
  providers: [CompanyAssesmentService],
  exports: [CompanyAssesmentService],
})
export class CompanyAssesmentModule {}
