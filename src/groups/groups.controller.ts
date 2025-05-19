import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Request, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { MembersDto, UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';


@ApiTags('Group')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }


  @ApiOperation({ summary: 'Create a group' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Request() req: any) {
    const userId = req.user.id
    createGroupDto.memberId = userId
    createGroupDto.createdBy = userId
    const group = await this.groupsService.createGroup(createGroupDto);
    return new ApiSuccessResponse(HttpStatus.CREATED, true, 'Group created successfully', group)
  }


  @ApiOperation({ summary: 'Get all groups' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: any, @Query() query: any) {
    query.userId = req.user.id
    console.log(query)
    const myGroups = await this.groupsService.getAllOfMyGroups(query);
    return new ApiSuccessResponse(HttpStatus.CREATED, true, 'Group list get  successfully', myGroups)

  }


  @ApiOperation({ summary: 'Get a group details ' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ description: 'add the groupId in param', name: 'groupId', required: true })
  @UseGuards(JwtAuthGuard)
  @Get(':groupId')
  async findOne(@Param('groupId') groupId: string) {
    const group = await this.groupsService.getGroupDetails(groupId);
    if (!group) {
      return new ApiErrorResponse(HttpStatus.NOT_FOUND, false, 'Group details not found')
    }
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Group details get successfully', group)

  }

  @ApiOperation({ summary: 'Update the  group details ' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiBody({ description: 'update details by this feilds', type: UpdateGroupDto, required: true })
  @ApiParam({ description: 'add the groupId in param', name: 'groupId', required: true })
  @UseGuards(JwtAuthGuard)
  @Get(':groupId')
  @Patch(':groupId')
  async update(@Param('groupId') groupId: string, @Body() updateGroupDto: UpdateGroupDto) {
    const group = await this.groupsService.getGroupDetails(groupId);
    if (!group) {
      return new ApiErrorResponse(HttpStatus.NOT_FOUND, false, 'Group details not found')
    }
    const updatedGroupInfo = await this.groupsService.updateGroup(groupId, updateGroupDto);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Group details updated  successfully', updatedGroupInfo)
  }


  @ApiOperation({ summary: 'add members the group' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ description: 'add the groupId in param', name: 'groupId', required: true })
  @ApiBody({ description: 'gives the members id as array of ids', type: MembersDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':groupId/addMembers')
  async addparticipents(@Param('groupId') groupId: string, @Body() body: any) {
    const updatedGroup = await this.groupsService.addMembers(groupId, body)
    return new ApiSuccessResponse(HttpStatus.OK, true, 'members added successfully', updatedGroup);

  }



  @ApiOperation({ summary: 'Removed Members from the groups' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ description: 'add the groupId in param', name: 'groupId', required: true })
  @ApiBody({ description: 'gives the members id as array of ids', type: MembersDto })
  @UseGuards(JwtAuthGuard)
  @Patch(':groupId/removed')
  async removedMembers(@Param('groupId') groupId: string, @Body() dto: MembersDto) {
    const updatedGroup = await this.groupsService.removeMembers(groupId, dto.members)
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Members removed successfully', updatedGroup);

  }



  @ApiOperation({ summary: 'Delete the group' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ description: 'add the groupId in param', name: 'groupId', required: true })
  @UseGuards(JwtAuthGuard)
  @Delete(':groupId')
  async remove(@Param('groupId') groupId: string) {
    const group = await this.groupsService.getGroupDetails(groupId);
    if (!group) {
      return new ApiErrorResponse(HttpStatus.NOT_FOUND, false, 'Group details not found')
    }
    const deletedGroup = await this.groupsService.deleteGroup(groupId);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Group deleted  successfully', deletedGroup)

  }
}
