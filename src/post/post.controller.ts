import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles, HttpStatus, UploadedFile, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { CloudinaryService } from 'src/utils/cloudinary/uploads.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { QueryPostDto } from './dto/post-query.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService,
    private readonly cloudinaryService: CloudinaryService

  ) { }
  @UseGuards(JwtAuthGuard)
  @Post('create')

  async create(
    @Request() req: any,
    @Body() createPostDto: CreatePostDto
  ) {
    const user = req.user
    createPostDto.userId = user.id
    const post = await this.postService.create(createPostDto);
    console.log(post);
    return new ApiSuccessResponse(HttpStatus.CREATED, true, 'post created successfully', post)
  }




  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.cloudinaryService.uploadImage(file);
      return { url: result.secure_url };  // Returning image URL
    } catch (error) {
      return { error: error.message };
    }
  }
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.cloudinaryService.uploadVideo(file);
      return { url: result.secure_url }; // Returning video URL
    } catch (error) {
      return { error: error.message };
    }
  }

  // Its returns a specefic user  all created post list.
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll(@Request() req: any, @Query() query: QueryPostDto) {
    const { posts, total, page, pageSize, totalPages } = await this.postService.getUserAllPosts(req.user.id, query);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'All posts', { posts, total, page, pageSize, totalPages })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
