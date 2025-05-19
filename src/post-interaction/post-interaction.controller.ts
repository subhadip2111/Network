import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Request } from '@nestjs/common';
import { PostInteractionService } from './post-interaction.service';
import { CreatePostInteractionDto, ReactionType } from './dto/create-post-interaction.dto';
import { UpdatePostInteractionDto } from './dto/update-post-interaction.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { PostService } from 'src/post/post.service';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { InteractionType } from './entities/post-interaction.entity';
import { UsersCollabrateService } from 'src/users-collabrate/users-collabrate.service';



@ApiTags('Post-interactions')
@Controller('post-interactions')
export class PostInteractionController {
  constructor(private readonly postInteractionService: PostInteractionService,
    private readonly postService: PostService,
    private readonly usesCollabratorService:UsersCollabrateService

  ) { }

  @ApiOperation({ summary: 'give a post Intraction ' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ name: 'postId', description: 'ID of the post to interact with', required: true })
  @ApiBody({type:CreatePostInteractionDto,description:'',required:true})
  @UseGuards(JwtAuthGuard)
  @Post('/:postId')
  async createInteraction(
    @Body() createPostInteractionDto: CreatePostInteractionDto,
    @Param('postId') postId: string,
    @Request() req: any,
  ) {
    const postDetails = await this.postService.findOne(postId);
    if (!postDetails) {
      return new ApiErrorResponse(HttpStatus.NOT_FOUND, false, 'Post not found ');
    }

    createPostInteractionDto.postId = postId;
    createPostInteractionDto.userId = req.user.id;

    const saveIntraction = await this.postInteractionService.create(
      createPostInteractionDto,
    );

    const updatedCounts: Partial<
      Record<
        'likeCount' | 'collaboratorCount' | 'supportCount' | 'insightfulCount',
        number
      >
    > = {};

    switch (createPostInteractionDto.type) {
      case ReactionType.LIKE:
        updatedCounts.likeCount = (postDetails.likeCount || 0) + 1;
        break;
      case ReactionType.COLLABORATE:
        updatedCounts.collaboratorCount =
          (postDetails.collaboratorCount || 0) + 1;
          const collabReq={
            userId:postDetails.userId,
            colabratorId:req.user.id,
            postId:postDetails.id

          }
          await this.usesCollabratorService.create(collabReq)
        break;
      case ReactionType.SUPPORT:
        updatedCounts.supportCount = (postDetails.supportCount || 0) + 1;
        break;
      case ReactionType.INSIGHTFUL:
        updatedCounts.insightfulCount = (postDetails.insightfulCount || 0) + 1;
        break;
      default:
        break;
    }

    await this.postService.updateIntractionCount(postId, updatedCounts);

    return new ApiSuccessResponse(
      HttpStatus.CREATED,
      true,
      'Interaction added successfully',
      saveIntraction,
    );
  }


  @ApiOperation({ summary: 'Get a post Intraction details' })
  @Get('/:postId')
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @ApiParam({ name: 'postId', description: 'give the postId', required: true })
  @UseGuards(JwtAuthGuard)
  async getAllInteractions(@Param('postId') postId: string) {
    const postDetails = await this.postService.findOne(postId);
    if (!postDetails) { return new ApiErrorResponse(HttpStatus.NOT_FOUND, false, 'Post not found ') }
const postIntractionDetails=await this.postInteractionService.getPostDetailsWithInteractionsGrouped(postId)
 return new ApiSuccessResponse(HttpStatus.OK,true,'Intraction details ',postIntractionDetails)


  }

  @Get(':id')
  async getInteractionById(@Param('id') id: string) {
    return this.postInteractionService.findOne(id);
  }

  @Patch(':id')
  async updateInteraction(
    @Param('id') id: string,
    @Body() updatePostInteractionDto: UpdatePostInteractionDto,
  ) {
    return this.postInteractionService.update(id, updatePostInteractionDto);
  }

  @Delete(':id')
  async deleteInteraction(@Param('id') id: string) {
    return this.postInteractionService.remove(id);
  }
}
