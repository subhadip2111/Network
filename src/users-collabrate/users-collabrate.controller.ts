import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { UsersCollabrateService } from './users-collabrate.service';
import { CreateUsersCollabrateDto } from './dto/create-users-collabrate.dto';
import { UpdateUsersCollabrateDto } from './dto/update-users-collabrate.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';

@ApiTags('User-collabrator')
@Controller('users-collabrate')
export class UsersCollabrateController {
  constructor(private readonly usersCollabrateService: UsersCollabrateService) { }

  // @ApiOperation({ summary: 'send collabration  request ' })
  // @ApiBearerAuth('access-token')
  // @ApiSecurity('x-api-key')
  // @ApiBody({ type: CreateUsersCollabrateDto, description: '', required: true })
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async create(@Body() createUsersCollabrateDto: CreateUsersCollabrateDto) {
  //   // send the user that someone send a collabrate request via email or push notification
  //   const collabrationRequest = await this.usersCollabrateService.create(createUsersCollabrateDto);
  //   return new ApiSuccessResponse(HttpStatus.CREATED, true, 'Collabration request sent successfully', collabrationRequest)
  // }

  @ApiOperation({ summary: 'view all collabration request' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ description: 'userId', required: true, name: "userId" })
  @Get(':userId')
  async findAll(@Param('userId') userId: string ,@Query()query:any) {
    const getAllcollabrequest = await this.usersCollabrateService.getAllCollabRequest(userId,query);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Collabration request list retrive successfully', getAllcollabrequest)
  }

  @ApiOperation({ summary: 'view collabration request details' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ description: 'collabrationId', required: true, name: "collabrationId" })
  @Get(':collabrationId')
  async findOne(@Param('collabrationId') collabrationId: string) {
    const collabrationDetails = await this.usersCollabrateService.findOne(collabrationId);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'get collabartion request details', collabrationDetails);

  }

  @ApiOperation({ summary: 'Update collabration request' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ description: 'collabrationId', required: true, name: "collabrationId" })
  @Patch(':collabrationId')
  async update(@Param('collabrationId') collabrationId: string, @Body() updateUsersCollabrateDto: UpdateUsersCollabrateDto) {
    const updateCOllabRequest = await this.usersCollabrateService.update(collabrationId, updateUsersCollabrateDto);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'collabration request status updated successfully', updateCOllabRequest);

  }

}
