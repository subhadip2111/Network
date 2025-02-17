import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { IsUUID } from 'class-validator'; // You can use this if you want to validate the UUID format

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly postRepository: Repository<Post>) { }
  async create(createPostDto: CreatePostDto) {
    const post = Object.create(createPostDto)
    await this.postRepository.save(post);
    console.log(post);

    return post;
  }

  findAll() {
    return `This action returns all post`;
  }

  async findOne(id: string) {  // Ensure that `id` is a string (UUID)
    try {
      // Optionally validate the UUID format (uncomment if needed)
      // if (!IsUUID(id)) {
      //   throw new Error('Invalid UUID format');
      // }
  
      console.log("Finding post with id:", id); // Log the id for debugging
  
      // Use `id` directly as it's a string (UUID)
      const post = await this.postRepository.findOne({
        where: { id } // No need to parse or convert to a number
      });
  
      if (!post) {
        console.log("Post not found!");
        return null;
      }
  
      console.log("Yeah, we got the post:", post);
      return post;
    } catch (error) {
      console.log("Oops, something went wrong:", error.message);
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

  async remove(id: number) {
    const post = await this.postRepository.delete(id)
  }
}
