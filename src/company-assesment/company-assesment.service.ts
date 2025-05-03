import { Injectable } from '@nestjs/common';
import { CreateCompanyAssesmentDto } from './dto/create-company-assesment.dto';
import { UpdateCompanyAssesmentDto } from './dto/update-company-assesment.dto';

@Injectable()
export class CompanyAssesmentService {
  create(createCompanyAssesmentDto: CreateCompanyAssesmentDto) {
    return 'This action adds a new companyAssesment';
  }

  findAll() {
    return `This action returns all companyAssesment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyAssesment`;
  }

  update(id: number, updateCompanyAssesmentDto: UpdateCompanyAssesmentDto) {
    return `This action updates a #${id} companyAssesment`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyAssesment`;
  }
}
