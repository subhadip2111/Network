import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";


export enum ReactionType {
  LIKE = 'like',
  CELEBRATE = 'celebrate',
  SUPPORT = 'support',
  INSIGHTFUL = 'insightful',
}
export class CreatePostInteractionDto {
  @IsOptional()
  @ApiProperty()
  postId: string;

  @IsOptional()
  @ApiProperty()
  userId: string;


  @IsNotEmpty()
  @IsEnum(ReactionType)
  @ApiProperty()
  reaction: ReactionType;
}



  

  
