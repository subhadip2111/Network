import { Controller, Get, Param, Delete, HttpStatus, Patch, Body, UseGuards, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { CompanyProfileDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { QueryCompanyDto } from './dto/query-company.dto';
@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get('/all/public')
 async  findAll(@Query() query: QueryCompanyDto) {
   
    const {companies,
      total,
      totalPages,
      currentPage: page,}=await this.companyService.findAll(query);
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'All companies fetched successfully',
      { companies, total, totalPages, page },
    );
  }

  @Get('profile/:companyId')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'companyId',type: 'string',description: 'UUID of the company',required: true,})
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key') 
  async findOne(@Param('companyId') companyId: string) {
    const company = await this.companyService.findOne(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    return new ApiSuccessResponse( HttpStatus.OK, true,'Company details fetched successfully',company, );
  }

  @Patch('update/:companyId')
  @ApiOperation({ summary: 'Update company details' })
  @ApiParam({ name: 'companyId',
    type: 'string', description: 'UUID of the company',required: true,
  })
  @ApiBody({description: 'Company details to update', type: CompanyProfileDto,required: true,})
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key') 

  @UseGuards(JwtAuthGuard)
  async update(
    @Param('companyId') companyId: string,
    @Body() updateCompanyDto: CompanyProfileDto,
  ) {
    const company = await this.companyService.findOne(companyId);
    if (!company) {
      throw new ApiErrorResponse(
        HttpStatus.NOT_FOUND,
        false,
        'Company not found',
      )
    }

    const updatedCompany = await this.companyService.updateCompanyDetails(company, updateCompanyDto);
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'Company details updated successfully',
      updatedCompany,
    );

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
