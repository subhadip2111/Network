import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInteractionDto } from './dto/create-post-interaction.dto';
import { UpdatePostInteractionDto } from './dto/update-post-interaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InteractionType, PostInteraction } from './entities/post-interaction.entity';
import { In, Not, Repository } from 'typeorm';
import { Post, PostType } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostInteractionService {
  constructor(@InjectRepository(PostInteraction) private readonly postIntractionRepo: Repository<PostInteraction>,
@InjectRepository(Post) private readonly postrepo: Repository<Post>

) {

  }
  async create(createPostInteractionDto: any) {
    console.log(createPostInteractionDto  )
   return await  this.postIntractionRepo.save(createPostInteractionDto)
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
      .groupBy('postInteraction.type') 
      .getRawMany(); 
  
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


  async getPostDetailsWithInteractionsGrouped(postId: string): Promise<any> {
    const post = await this.postrepo.findOne({ where: { id: postId } });
    if (!post) {return null}
    const interactions = await this.postIntractionRepo
      .createQueryBuilder('pi')
      .leftJoin('pi.user', 'u')
      .where('pi.postId = :postId', { postId })
      .select(['pi.type', 'u.id', 'u.fullName'])
      .getMany();

    const groupedInteractions: { [key in InteractionType]?: User[] } = {};
    interactions.forEach((interaction) => {
      if (!groupedInteractions[interaction.type]) {
        groupedInteractions[interaction.type] = [];
      }
      groupedInteractions[interaction.type].push({
        id: interaction.user.id,
        username: interaction.user.fullName,
      } as any); 
    });

    return {
      ...post,
      interactionsByType: groupedInteractions,
    };
  }


// for now I wanted my feed comes based on my activity just think as  a user  what ever post Or video I like or give a intraction I need to fetch that similiar kind of 
// data as  a percent ratio.
// the types of post I have Idea ,resource,query ,prodeuct demo.in starting all are equal phase 25 %
// if i  increase to intarction on a post that postType value increase .and then in my feeds its possibity increas .
// In feture I need to Implement redis for user search keyword and user mind and his Interested key .intregate ai model to personalize post or make a better env


async myfeedsData(userId: string, limit: number = 10): Promise<Post[]> {
  const recentInteractions = await this.postIntractionRepo.find({
    where: { userId },
    relations: ['post'],
    order: { createdAt: 'DESC' },
    take: 100, 
  });

  const typeWeights: Record<PostType, number> = {
    [PostType.IDEA]: 0.25,
    [PostType.QUERY]: 0.25,
    [PostType.RESOURCES]: 0.25,
    [PostType.PRODUCT_DEMO]: 0.25,
  };

  const recentTypeCounts: Record<PostType, number> = {
    [PostType.IDEA]: 0,
    [PostType.QUERY]: 0,
    [PostType.RESOURCES]: 0,
    [PostType.PRODUCT_DEMO]: 0,
  };

  recentInteractions.forEach((interaction) => {
    if (interaction.post && recentTypeCounts[interaction.post.type] !== undefined) {
      recentTypeCounts[interaction.post.type]++;
    }
  });

  const totalRecentInteractions = recentInteractions.length;
  if (totalRecentInteractions > 0) {
    for (const type in recentTypeCounts) {
      if (recentTypeCounts.hasOwnProperty(type)) {
        typeWeights[type as PostType] = recentTypeCounts[type as PostType] / totalRecentInteractions;
      }
    }
  }

  const interactedPostIds = recentInteractions.map((interaction) => interaction.postId);
  const allNewPosts = await this.postrepo.find({
    where: { id: Not(In(interactedPostIds)) },
    relations: ['user'],
    order: { createdAt: 'DESC' },
    take: 1000, 
  });

  const feed: Post[] = [];
  const maxAttempts = allNewPosts.length * 2;
  let attempts = 0;

  while (feed.length < limit && attempts < maxAttempts && allNewPosts.length > 0) {
    attempts++;
    const randomIndex = Math.floor(Math.random() * allNewPosts.length);
    const potentialPost = allNewPosts[randomIndex];
    const randomWeight = Math.random();

    if (randomWeight < typeWeights[potentialPost.type]) {
      feed.push(potentialPost);
      allNewPosts.splice(randomIndex, 1);
    }
  }
  while (feed.length < limit && allNewPosts.length > 0) {
    feed.push(allNewPosts.shift()!);
  }
  return feed;
}
  

}
