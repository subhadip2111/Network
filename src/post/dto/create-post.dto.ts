import { IsOptional, IsString, IsEnum, IsArray, IsUrl } from 'class-validator';
import { PostType } from '../entities/post.entity';

export class CreatePostDto {

  @IsString()
  content: string;

  @IsOptional() 
  @IsString()
  user: string;

  @IsEnum(PostType)
  @IsOptional()  
  type: PostType;

  @IsOptional() 
  @IsArray() 
  @IsString({ each: true }) 
  imageUrls: string[];

  @IsOptional() 
  @IsUrl() 
  videoUrl: string | null;
}
