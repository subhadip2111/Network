import { IsOptional, IsString, IsEnum, IsArray, IsUrl, IsNotEmpty } from 'class-validator';
import { PostType } from '../entities/post.entity';

export class CreatePostDto {

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  title: string;


  @IsOptional() 
  @IsString()
  userId: string;

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
