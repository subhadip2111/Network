import { IsOptional, IsString, IsEnum, IsArray, IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty({ description: 'Post content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Post title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'User ID of the post creator' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ enum: PostType, description: 'Type of the post' })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiPropertyOptional({ description: 'Array of image URLs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiPropertyOptional({ description: 'Video URL', type: String, nullable: true })
  @IsOptional()
  @IsUrl()
  videoUrl?: string | null;
}
