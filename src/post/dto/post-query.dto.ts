import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '../entities/post.entity';

export class QueryPostDto {
  @ApiPropertyOptional({ enum: PostType, description: 'Type of post' })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Number of posts per page', example: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number;
}
