import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PostInterestsService } from './post-interests.service';
import { CreatePostInterestDto } from './dto/create-post-interest.dto';
import { UpdatePostInterestDto } from './dto/update-post-interest.dto';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';

@Controller('post-interests')
export class PostInterestsController {
  constructor(private readonly postInterestsService: PostInterestsService) {}

// NOTES: It's a strategy to show the user only the interests without deleting any existing ones.
@Post()
  async create(@Body() createPostInterestDto: CreatePostInterestDto) {
    try {
      const result = await this.postInterestsService.create(createPostInterestDto);
      return new ApiSuccessResponse(HttpStatus.CREATED, true, 'Post interest given successfully', result);
    } catch (error) {
      throw new Error(`Failed to create post interest: ${error.message}`);
    }
  }


  // find the top intereted post 

  @Get()
  findAll() {
    return this.postInterestsService.findAll();
  }
// Notes :

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postInterestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostInterestDto: UpdatePostInterestDto) {
    return this.postInterestsService.update(+id, updatePostInterestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postInterestsService.remove(+id);
  }
}
