import { IsOptional, IsString, IsEnum, IsArray, IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ description: 'User ID of the post creator' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ enum: PostType, description: 'Type of the post' })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiProperty({ description: 'Array of image URLs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({ description: 'Video URL', type: String, nullable: true })
  @IsOptional()
  @IsUrl()
  videoUrl?: string | null;

  @ApiProperty({ description: 'React js ', type: String, nullable: true })
  @IsOptional()
  tags?: string | null;


  @ApiProperty({ description: 'any resource url ', type: String, nullable: true })
  @IsOptional()
  resourceType: string


  @ApiProperty({ description: 'any demo  url ', type: String, nullable: true })
  @IsOptional()
  demoUrl: string

  @ApiProperty({ description: 'React js ,Node.js', type: String, nullable: true })
    @IsOptional()
  techStack: string | null;

  @ApiProperty({ description: 'any resource url ', type: String, nullable: true })
  @IsOptional()
  resourceUrls: string[]

  @ApiProperty({ description: 'any resource url ', type: String, nullable: true })
  @IsOptional()
  urgency: string

  @ApiProperty({ description: 'any resource url ', type: String, nullable: true })
  @IsOptional()
  seeking: string


}
