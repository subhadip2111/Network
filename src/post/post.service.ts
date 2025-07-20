import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Brackets, Repository } from 'typeorm';
import { IsUUID } from 'class-validator'; // You can use this if you want to validate the UUID format
import { QueryPostDto } from './dto/post-query.dto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) { }
  async create(createPostDto: CreatePostDto) {
    const post = Object.assign(createPostDto)
    await this.postRepository.save(post);
    return post;
  }



async findOne(postId: string) {
  try {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'], // Moved `relations` outside `where`
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return post;
  } catch (error) {
    throw error;
  }
}




  async update(postId: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({ where: { id: postId } })
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    Object.assign(post, updatePostDto);
    await this.postRepository.save(post);
    return post;
  }

  async updateIntractionCount(postId: string, updatePostDto: any) {
    const post = await this.postRepository.findOne({ where: { id: postId } })
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    Object.assign(post, updatePostDto);
    await this.postRepository.save(post);
    return post;
  }

  async remove(id: string) {
    const post = await this.postRepository.delete(id)
  }

  async getUserAllPosts(userId: string, query: QueryPostDto) {
    let { type, keyword, page, pageSize } = query;
    const queryBuilder = this.postRepository.createQueryBuilder('post')
      .where('post.userId = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('post.type = :type', { type });
    }

    if (keyword) {
      queryBuilder.andWhere(
        '(post.title ILIKE :keyword OR post.content ILIKE :keyword )',
        { keyword: `%${keyword}%` }
      );
    }

    const skip = (+page - 1) * +pageSize;

    const [posts, total] = await queryBuilder
      .skip(skip)
      .take(+pageSize)
      .getManyAndCount();

    return {

      posts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / +pageSize),
    };
  }

async feeds(user: any, query: QueryPostDto) {
  const { page = 1, pageSize = 10 } = query;

  const [feeds, total] = await this.postRepository.findAndCount({
    relations: ['user'], 
    order: {
      createdAt: 'DESC',
    },
    skip: (+page - 1) * +pageSize,
    take: +pageSize,
  });

  return {
    feeds,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / +pageSize),
  };
}








}






