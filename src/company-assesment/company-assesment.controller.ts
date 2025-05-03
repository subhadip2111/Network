import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyAssesmentService } from './company-assesment.service';
import { CreateCompanyAssesmentDto } from './dto/create-company-assesment.dto';
import { UpdateCompanyAssesmentDto } from './dto/update-company-assesment.dto';

@Controller('company-assesment')
export class CompanyAssesmentController {
  constructor(private readonly companyAssesmentService: CompanyAssesmentService) {}

  @Post()
  create(@Body() createCompanyAssesmentDto: CreateCompanyAssesmentDto) {
    return this.companyAssesmentService.create(createCompanyAssesmentDto);
  }

  @Get()
  findAll() {
    return this.companyAssesmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyAssesmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyAssesmentDto: UpdateCompanyAssesmentDto) {
    return this.companyAssesmentService.update(+id, updateCompanyAssesmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyAssesmentService.remove(+id);
  }
}
