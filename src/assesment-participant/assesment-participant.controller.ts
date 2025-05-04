import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpStatus, BadGatewayException, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AssesmentParticipantService } from './assesment-participant.service';
import { CreateAssesmentParticipantDto } from './dto/create-assesment-participant.dto';
import { UpdateAssesmentParticipantDto } from './dto/update-assesment-participant.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { QueueService } from 'src/queue/queue.service';
import { CompanyAssesmentService } from 'src/company-assesment/company-assesment.service';
import { formatToIST } from 'src/utils/dateFormatter';
import { UseronlyGaurds } from 'src/auth/gaurds/UserOnlyGuards';
import { queryAssesmentParticipantDto } from './dto/assesmentParticipant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/utils/cloudinary/uploads.service';
import { CompanyOnlyGuard } from 'src/auth/gaurds/CompanyOnlyGuard';
@ApiTags('Assesment Participant')
@Controller('assesment-participant')
export class AssesmentParticipantController {
  constructor(private readonly assesmentParticipantService: AssesmentParticipantService,
    private readonly queueService: QueueService
    , private readonly assesmentService: CompanyAssesmentService,

    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post('/register')
  @UseGuards(JwtAuthGuard, UseronlyGaurds)
  @ApiOperation({ summary: 'Register a user for a company assessment' })
  @ApiBody({
    type: CreateAssesmentParticipantDto,
    description: 'Payload to register the user for an assessment',
  })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  async create(@Body() createAssesmentParticipantDto: CreateAssesmentParticipantDto, @Request() req: any) {
    createAssesmentParticipantDto.userId = req.user.id;
    const assesmentdetails = await this.assesmentService.getDetailsById(createAssesmentParticipantDto.assessmentId);
    if (!assesmentdetails) {
      return new BadGatewayException('Assessment not found');
    }
    const registerAssesment = await this.assesmentParticipantService.showInterestInAssesment(createAssesmentParticipantDto,);
    const startTime = await formatToIST(assesmentdetails.startTime.toISOString());
    await this.queueService.sendAssessmentEmailJob(req.user.email, req.user.fullName, assesmentdetails.meetingLink, startTime, assesmentdetails.company.name);
    return new ApiSuccessResponse(HttpStatus.CREATED, true, 'User registered for assessment successfully', registerAssesment);
  }

  @Get('all/my-assessment')
  @UseGuards(JwtAuthGuard, UseronlyGaurds)
  @ApiOperation({ summary: 'Get all assessments for a user' })
  @ApiParam({ name: 'userId', type: 'string', description: 'UUID of the user', required: true, })
  @ApiQuery({ type: queryAssesmentParticipantDto })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  async findAllOfMyAssesmentList(@Query() query: queryAssesmentParticipantDto, @Request() req: any, @Param('userId') userId: string) {
    query.userId = req.user.id;
    const { data, totalPages, currentPage, totalAssessments } = await this.assesmentParticipantService.getAllMyAssesments(query);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'All assessments fetched successfully', { data, totalPages, currentPage, totalAssessments });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UseronlyGaurds)
  @ApiOperation({ summary: 'Get assessment details' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the assessment participant', required: true })
  @ApiQuery({ type: queryAssesmentParticipantDto })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  async findOne(@Param('id') id: string) {
    const assesmentdetails = await this.assesmentParticipantService.viewAssesmentDetails(id,);
    if (!assesmentdetails) {
      return new BadGatewayException('Assessment not found');
    }
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Assessment details fetched successfully', assesmentdetails);
  }

  // when  the user is submit the assesment then need to update the assesment status 
  @Patch(':id/submit')
  @UseGuards(JwtAuthGuard, UseronlyGaurds)
  @ApiOperation({ summary: 'Submit Assessment' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the assessment participant', required: true })
  @ApiBody({ type: UpdateAssesmentParticipantDto })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  async submitAssessment(
    @Param('id') id: string,
    @Body() updateAssesmentParticipantDto: UpdateAssesmentParticipantDto,
    @Request() req: any,
  ) {
    const participant = await this.assesmentParticipantService.viewAssesmentDetails(id);
    if (!participant) {
      return new BadGatewayException('Assesment participent  not found');
    }
    const assessmentId = participant.assessmentId;
    const assessment = await this.assesmentService.getDetailsById(assessmentId);
    updateAssesmentParticipantDto.status = 'COMPLETE';
    updateAssesmentParticipantDto.submittedAt = new Date().toISOString();
    const result = await this.assesmentParticipantService.submitAsssment(participant, updateAssesmentParticipantDto);
    await this.queueService.sendAssessmentSubmissionEmailJob(
      req.user.email,
      req.user.fullName,
      assessment.company.name,
    );
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Assessment submitted successfully', result);
  }


  @Post('upload-zip')
  @UseInterceptors(FileInterceptor('file'))
  async uploadZip(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadRawFile(file);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'File uploaded successfully', { url: result.secure_url });
  }



// this is for the company to get all the participants of the assessment
  @Get('all/participants/:assessmentId')
  @UseGuards(JwtAuthGuard,CompanyOnlyGuard)
  @ApiOperation({ summary: 'Get all participants activity for an assessment' })
  @ApiParam({ name: 'assessmentId', type: 'string', description: 'UUID of the assessment', required: true, })
  @ApiQuery({ type: queryAssesmentParticipantDto })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  async getParticipantsByAssessmentId(@Param('assessmentId') assessmentId: string, @Query() queryObj: queryAssesmentParticipantDto) {
    const { data, totalPages, currentPage } = await this.assesmentParticipantService.getParticipantsByAssessmentId(assessmentId, queryObj);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'All participants fetched successfully', { data, totalPages, currentPage, });
  }

// get a comapny all assessment  with the participants activity
  @Get('all/assesments/:companyId')
  @UseGuards(JwtAuthGuard,CompanyOnlyGuard)
  @ApiOperation({ summary: 'Get all assessments for a company' })
  @ApiParam({ name: 'companyId', type: 'string', description: 'UUID of the company', required: true, })
  @ApiQuery({ type: queryAssesmentParticipantDto })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  async getAllAssesmentsByCompanyId(@Param('companyId') companyId: string, @Query() queryObj: queryAssesmentParticipantDto) {
    const { data, totalPages, currentPage } = await this.assesmentParticipantService.getParticipantsByCompany(companyId, queryObj);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'All assessments fetched successfully', { data, totalPages, currentPage });
  }


}
