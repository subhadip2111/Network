import { Injectable } from '@nestjs/common';
import { CreatePostInterestDto } from './dto/create-post-interest.dto';
import { UpdatePostInterestDto } from './dto/update-post-interest.dto';

@Injectable()
export class PostInterestsService {
  create(createPostInterestDto: CreatePostInterestDto) {
    return 'This action adds a new postInterest';
  }

  findAll() {
    return `This action returns all postInterests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postInterest`;
  }

  update(id: number, updatePostInterestDto: UpdatePostInterestDto) {
    return `This action updates a #${id} postInterest`;
  }

  remove(id: number) {
    return `This action removes a #${id} postInterest`;
  }
}
