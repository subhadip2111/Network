import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInteractionDto } from './dto/create-post-interaction.dto';
import { UpdatePostInteractionDto } from './dto/update-post-interaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostInteraction } from './entities/post-interaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostInteractionService {
  constructor(@InjectRepository(PostInteraction) private readonly postIntractionRepo: Repository<PostInteraction>) {

  }
  async create(createPostInteractionDto: CreatePostInteractionDto) {
    return 'This action adds a new postInteraction';
  }

  async findAll(postId: string) {
    const userListByType = await this.postIntractionRepo
      .createQueryBuilder('postInteractions')
      .leftJoin('postInteractions.user', 'user')
      .select([
        'postInteractions.type AS type',
        'user.id AS userId',
        'user.fullName AS username',
      ])
      .where('postInteractions.postId = :postId', { postId })
      .groupBy('postInteractions.type, user.id, user.fullName')
      .getRawMany();
  
    // Format result as: { like: [users], support: [users], ... }
    const formatted = userListByType.reduce((acc, curr) => {
      const { type, userId, username } = curr;
  
      if (!acc[type]) {
        acc[type] = [];
      }
  
      acc[type].push({
        id: userId,
        username,
      });
  
      return acc;
    }, {} as Record<string, { id: string; username: string }[]>);
  
    return {
      postId,
      interactionUsers: formatted,
    };
  }
  
  async getTotalInteractionsCountForPost(postId: string) {
    const interactionSummary = await this.postIntractionRepo.createQueryBuilder('postInteraction')
      .leftJoin('postInteraction.user', 'user')
      .where('postInteraction.postId = :postId', { postId })
      .select([
        'postInteraction.type AS interactionType',
        'COUNT(postInteraction.id) AS totalInteractions',
      ])
      .groupBy('postInteraction.type') // Group by interaction type
      .getRawMany(); // Get raw results
  
    return interactionSummary;
  }
  

  async findOne(id: string) {
    return `This action returns a #${id} postInteraction`;
  }



  async getAllInteractions() {
    const interactions = await this.postIntractionRepo.createQueryBuilder('postInteraction')
      .leftJoinAndSelect('postInteraction.user', 'user') // Join user details
      .leftJoinAndSelect('postInteraction.post', 'post') // Join post details
      .select([
        'postInteraction.type AS interactionType',
        'postInteraction.postId AS postId',
        'user.id AS userId',
        'user.fullName AS username',
        'post.title AS postTitle',
        'post.createdAt AS postCreatedAt',
        'postInteraction.createdAt AS interactionCreatedAt',
      ])
      .orderBy('postInteraction.createdAt', 'DESC') // Sort by interaction date
      .getRawMany(); // Get raw results
  
    return interactions;
  }
  
  async update(id: string, updatePostInteractionDto: UpdatePostInteractionDto) {
    return `This action updates a #${id} postInteraction`;
  }



  
  async remove(id: string) {
    return `This action removes a #${id} postInteraction`;
  }

  async findAlldata(postId: string) {
    // Step 1: Get grouped interaction data by type and user
    const [result] = await this.postIntractionRepo
      .createQueryBuilder('postInteractions')
      .leftJoin('postInteractions.user', 'user')
      .select([
        'postInteractions.type AS type',
        'user.id AS userId',
        'user.fullName AS username',
        'COUNT(postInteractions.id) AS count'
      ])
      .where('postInteractions.postId = :postId', { postId })
      .groupBy('postInteractions.type, user.id, user.fullName')
      .getRawMany()
      .then(data => [data]); // mimic [result, count] structure for uniformity
  
    // Step 2: Format result
    const formattedSummary = result.reduce((acc, item) => {
      const { type, userId, username, count } = item;
  
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          users: [],
        };
      }
  
      acc[type].count += parseInt(count, 10);
      acc[type].users.push({ id: userId, username });
  
      return acc;
    }, {} as Record<string, { count: number; users: { id: string; username: string }[] }>);
  
    // Step 3: Get stored counts from the post table
    const post = await this.postIntractionRepo.findOne({ where: { postId: postId } });
  
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  
    // Step 4: Inject counts from post table
    const interactionTypes = ['like', 'support', 'insightful', 'colabrator'];
    interactionTypes.forEach((type) => {
      const postCount = post[`${type}Count`] || 0;
      if (formattedSummary[type]) {
        formattedSummary[type].count = postCount;
      } else {
        formattedSummary[type] = {
          count: postCount,
          users: [],
        };
      }
    });
  
    return {
      postId,
      interactionSummary: formattedSummary,
    };
  }
  








}
