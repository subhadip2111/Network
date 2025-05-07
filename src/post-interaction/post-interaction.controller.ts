import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostInteractionService } from './post-interaction.service';
import { CreatePostInteractionDto } from './dto/create-post-interaction.dto';
import { UpdatePostInteractionDto } from './dto/update-post-interaction.dto';

@Controller('post-interaction')
export class PostInteractionController {
  constructor(private readonly postInteractionService: PostInteractionService) {}

  @Post()
  create(@Body() createPostInteractionDto: CreatePostInteractionDto) {
    return this.postInteractionService.create(createPostInteractionDto);
  }

  @Get()
  findAll() {
    return this.postInteractionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postInteractionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostInteractionDto: UpdatePostInteractionDto) {
    return this.postInteractionService.update(+id, updatePostInteractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postInteractionService.remove(+id);
  }
}
