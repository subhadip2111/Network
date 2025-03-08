import { Injectable } from '@nestjs/common';
import { CreatePostInterestDto } from './dto/create-post-interest.dto';
import { UpdatePostInterestDto } from './dto/update-post-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostInterest } from './entities/post-interest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostInterestsService {
  constructor(@InjectRepository(PostInterest) private readonly repo:Repository<PostInterest>){}

// TODO: Send a notification to the post owner when someone shows interest in their post.
async  create(createPostInterestDto: CreatePostInterestDto) {
  const result = await this.repo.save(createPostInterestDto);
  return result;
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
