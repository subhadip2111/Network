import { Injectable } from '@nestjs/common';
import { CreatePostInteractionDto } from './dto/create-post-interaction.dto';
import { UpdatePostInteractionDto } from './dto/update-post-interaction.dto';

@Injectable()
export class PostInteractionService {
  create(createPostInteractionDto: CreatePostInteractionDto) {
    return 'This action adds a new postInteraction';
  }

  findAll() {
    return `This action returns all postInteraction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postInteraction`;
  }

  update(id: number, updatePostInteractionDto: UpdatePostInteractionDto) {
    return `This action updates a #${id} postInteraction`;
  }

  remove(id: number) {
    return `This action removes a #${id} postInteraction`;
  }
}
