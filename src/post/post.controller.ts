import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles, HttpStatus } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { CloudinaryService } from 'src/utils/cloudinary/uploads.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';

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
    createPostDto.user = user.id
    const post=await  this.postService.create(createPostDto);
    console.log(post);
    return new ApiSuccessResponse(HttpStatus.CREATED,true,'post created successfully',post)
  }

  @Post('uploadsMedia/:postId')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'imageUrls', maxCount: 10 },
    { name: 'video', maxCount: 1 },
  ])
)
async uploadsMedia(
  @Request() req: any,
  @Param('postId') postId: string,
  @Body() createPostDto: UpdatePostDto,
  @UploadedFiles() files: { imageUrls?: Express.Multer.File[]; video?: Express.Multer.File[] }
) {
  

  let imageUrls: string[] = [];
  let videoUrl: string | null = null;
console.log("post id from controller as string",postId)
  // Handle image file uploads
  if (files && files.imageUrls) {
    for (const image of files.imageUrls) {
      const imageResult = await this.cloudinaryService.uploadImage(image);
      imageUrls.push(imageResult.secure_url);
    }
  }

  // Handle video file uploads
  if (files && files.video && files.video[0]) {
    const videoResult = await this.cloudinaryService.uploadVideo(files.video[0]);
    videoUrl = videoResult.secure_url;
  }

  // Assign imageUrls and videoUrl to createPostDto
  createPostDto.imageUrls = imageUrls.length > 0 ? imageUrls : undefined;
  createPostDto.videoUrl = videoUrl || null;

  // Update post with new URLs
  console.log("object",postId)
  return await this.postService.update(postId, createPostDto);
}



  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Post('uploads')
  async uploadImage() {

  }

  @Post('uploads')
  async UploadsVideo() {

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
