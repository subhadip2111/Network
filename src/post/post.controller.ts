import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles, HttpStatus, UploadedFile, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { CloudinaryService } from 'src/utils/cloudinary/uploads.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { QueryPostDto } from './dto/post-query.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,
    private readonly cloudinaryService: CloudinaryService) { }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth('access-token')
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Request() req: any, @Body() createPostDto: CreatePostDto) {
    const user = req.user
    createPostDto.userId = user.id
    const post = await this.postService.create(createPostDto);
    return new ApiSuccessResponse(HttpStatus.CREATED, true, 'post created successfully', post)
  }


  @ApiOperation({ summary: 'Uploads Image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @Post('uploads/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.cloudinaryService.uploadImage(file);
      return { url: result.secure_url };
    } catch (error) {
      return { error: error.message };
    }
  }

  @ApiOperation({ summary: 'Uploads videos ' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @Post('uploads/video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.cloudinaryService.uploadVideo(file);
      return { url: result.secure_url };
    } catch (error) {
      return { error: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all posts of a user ' })
  @ApiBearerAuth('access-token')
  @ApiQuery({ type: QueryPostDto, description: 'Query parameters for pagination and filtering', required: false })
  @ApiSecurity('x-api-key')
  @Get('/all')
  async findAll(@Request() req: any, @Query() query: QueryPostDto) {
    const { posts, total, page, pageSize, totalPages } = await this.postService.getUserAllPosts(req.user.id, query);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'All posts', { posts, total, page, pageSize, totalPages })
  }



  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user Feeds ' })
  @Get('/feeds')

  async getMyFeeds(@Request() req: any, @Query() query: QueryPostDto) {
    const userInfo = req.user;
    const { feeds,
      total,
      page,
      pageSize,
      totalPages } = await this.postService.feeds(userInfo, query);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Fedds data get successfuly', {
      feeds,
      total,
      page,
      pageSize,
      totalPages
    })
  }



  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a post details by Id ' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const postDetails = await this.postService.findOne(id);
    if (!postDetails) { return new ApiSuccessResponse(HttpStatus.NOT_FOUND, false, 'Post not found', null) }
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Post details retrive successfully', postDetails)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update post by ID ' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @Patch('edit/:id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const updatedPost = await this.postService.update(id, updatePostDto);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Post updated successfully', updatedPost)
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'delete post by ID ' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const postDetails = await this.postService.findOne(id);
    if (!postDetails) {
      return new ApiSuccessResponse(HttpStatus.NOT_FOUND, false, 'Post not found', null)
    }
    const deletedPost = await this.postService.remove(id);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Post deleted successfully', deletedPost)

  }
}
