export class CreatePostInteractionDto {}


export enum ReactionType {
    LIKE = 'like',
    LOVE = 'love',
    CELEBRATE = 'celebrate',
    SUPPORT = 'support',
    INSIGHTFUL = 'insightful',
  }
  
  export class PostReactionKafkaPayload {
    postId: string;
    userId: string;
    userName: string;
    reaction: ReactionType;
  }
  
