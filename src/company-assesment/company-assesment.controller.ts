import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { CompanyAssesmentService } from './company-assesment.service';
import { CreateCompanyAssessmentDto } from './dto/create-company-assesment.dto';
import { UpdateCompanyAssesmentDto } from './dto/update-company-assesment.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiSecurity, ApiTags, ApiQuery, } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { AssessmentQueryDto } from './dto/assesment.query.dto';
import { CompanyOnlyGuard } from 'src/auth/gaurds/CompanyOnlyGuard';
@ApiTags('Assesment')
@Controller('company-assesment')
export class CompanyAssesmentController {
  constructor(private readonly companyAssesmentService: CompanyAssesmentService) { }

  @Post('/create/:companyId')
  @ApiOperation({ summary: 'Add new assesment ' })
  @ApiParam({ name: 'companyId', type: 'string', description: 'UUID of the company', required: true, })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, CompanyOnlyGuard)
  async create(@Body() createCompanyAssessmentDto: CreateCompanyAssessmentDto, @Param('companyId') companyId: string) {
    createCompanyAssessmentDto.companyId = companyId;
    const assesment = await this.companyAssesmentService.createAssesment(createCompanyAssessmentDto);
    return new ApiSuccessResponse(HttpStatus.CREATED, true, 'Company assesment created successfully', assesment);
  }

  @Get('details/:assessmentId')
  @ApiOperation({ summary: 'View assessment details by ID' })
  @ApiParam({ name: 'assessmentId', type: 'string', description: 'UUID of the assessment', required: true, })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, CompanyOnlyGuard)
  async viewAssessmentDetails(@Param('assessmentId') assessmentId: string) {
    const assessment = await this.companyAssesmentService.getDetailsById(assessmentId);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Assessment details fetched successfully', assessment,)
  };


  @Patch('update/:assessmentId')
  @ApiOperation({ summary: 'Update assessment details' })
  @ApiParam({ name: 'assessmentId', type: 'string', description: 'UUID of the assessment', required: true, })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, CompanyOnlyGuard)
  async update(@Param('assessmentId') assessmentId: string, @Body() updateCompanyAssesmentDto: UpdateCompanyAssesmentDto) {
    const assesment = await this.companyAssesmentService.getDetailsById(assessmentId);
    if (!assesment) {
      throw new Error('Assessment not found');
    }
    const updatedAssesment = await this.companyAssesmentService.update(assesment, updateCompanyAssesmentDto);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Assessment updated successfully', updatedAssesment);
  }

  @Delete('delete/:assessmentId')
  @ApiOperation({ summary: 'Delete assessment by ID' })
  @ApiParam({ name: 'assessmentId', type: 'string', description: 'UUID of the assessment', required: true, })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, CompanyOnlyGuard)
  async remove(@Param('assessmentId') assessmentId: string) {
    const assesment = await this.companyAssesmentService.remove(assessmentId);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Assessment deleted successfully', assesment);
  }
  @Get('all')
  @ApiOperation({ summary: 'Get all assessments' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default is 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of records per page (default is 10)' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Keyword to search in position or description' })
  @ApiQuery({ name: 'fromDate', required: false, type: String, description: 'Filter from date (ISO format)' })
  @ApiQuery({ name: 'toDate', required: false, type: String, description: 'Filter to date (ISO format)' })

  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, CompanyOnlyGuard)
  async findAll(@Query() query: AssessmentQueryDto) {
    const assessments = await this.companyAssesmentService.findAllAssesments(query);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'All assessments fetched successfully', assessments);
  }
  @Get('company/:companyId/assessments')
  @ApiOperation({ summary: 'Get all assessments by company ID' })
  @ApiParam({ name: 'companyId', type: 'string', description: 'UUID of the company', required: true, })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, CompanyOnlyGuard)
  async findByCompanyId(@Param('companyId') companyId: string) {
    const assessments = await this.companyAssesmentService.findAllByCompanyId(companyId);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'All assessments fetched successfully', assessments);
  }

}


