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
        where: { id:postId }
      });
      if (!post) {

         throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      return post;
    } catch (error) {
      return null;
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

    const skip = (page - 1) * pageSize;

    const [posts, total] = await queryBuilder
      .skip(skip)
      .take(pageSize)
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
  const { keyword, page = 1, pageSize = 10 } = query;

  const queryBuilder = this.postRepository.createQueryBuilder('post');

  if (keyword) {
    queryBuilder.andWhere(
      `(post.title ILIKE :keyword 
        OR post.content ILIKE :keyword 
        OR post.techStack ILIKE :keyword 
        OR post.tags ILIKE :keyword)`,
      { keyword: `%${keyword}%` }
    );
  }

  if (user.skills?.length) {
    queryBuilder.andWhere(
      new Brackets((qb) => {
        user.skills.forEach((skill, index) => {
          qb.orWhere(`post.techStack ILIKE :skill${index}`, {
            [`skill${index}`]: `%${skill}%`,
          });
        });
      })
    );
  }

  if (user.bio) {
    const bioKeywords = user.bio.split(/\s+/).slice(0, 5); 
    queryBuilder.andWhere(
      new Brackets((qb) => {
        bioKeywords.forEach((word, index) => {
          qb.orWhere(`post.content ILIKE :bioWord${index}`, {
            [`bioWord${index}`]: `%${word}%`,
          });
        });
      })
    );
  }

  if (user.interest) {
    queryBuilder.andWhere(
      `(post.title ILIKE :interest OR post.tags ILIKE :interest)`,
      { interest: `%${user.interest}%` }
    );
  }

  if (user.role === 'student') {
    queryBuilder.andWhere(`post.type IN (:...types)`, {
      types: ['idea', 'query', 'resources'],
    });
  }
  const skip = (page - 1) * pageSize;
  queryBuilder.skip(skip).take(pageSize);
  const [feeds, total] = await queryBuilder.getManyAndCount();
  return {
    feeds,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}


 }






