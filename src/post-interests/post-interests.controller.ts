import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostInterestsService } from './post-interests.service';
import { CreatePostInterestDto } from './dto/create-post-interest.dto';
import { UpdatePostInterestDto } from './dto/update-post-interest.dto';

@Controller('post-interests')
export class PostInterestsController {
  constructor(private readonly postInterestsService: PostInterestsService) {}

  @Post()
  create(@Body() createPostInterestDto: CreatePostInterestDto) {
    return this.postInterestsService.create(createPostInterestDto);
  }

  @Get()
  findAll() {
    return this.postInterestsService.findAll();
  }

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
