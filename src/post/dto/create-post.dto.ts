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

  @ApiPropertyOptional({ description: 'React js ', type: String, nullable: true })
  @IsOptional()
  tags?: string | null;


  @ApiPropertyOptional({ description: 'any resource url ', type: String, nullable: true })
  @IsOptional()
  resourceType: string


  @ApiPropertyOptional({ description: 'any demo  url ', type: String, nullable: true })
  @IsOptional()
  demoUrl: string

  @ApiPropertyOptional({ description: 'React js ,Node.js', type: String, nullable: true })
  techStack: string | null;

  @ApiPropertyOptional({ description: 'any resource url ', type: String, nullable: true })
  @IsOptional()
  resourceUrls: string[]
  @ApiPropertyOptional({ description: 'any resource url ', type: String, nullable: true })
  @IsOptional()

  urgency: string
  @ApiPropertyOptional({ description: 'any resource url ', type: String, nullable: true })

  @IsOptional()
  seeking: string


}
