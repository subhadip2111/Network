import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '../entities/post.entity';
import { Type } from 'class-transformer';

export class QueryPostDto {
  @ApiProperty({ enum: PostType, description: 'Type of post' })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType;

  @ApiProperty({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsNumber()
  page?: string;

  @ApiProperty({ description: 'Number of posts per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsNumber()
  pageSize?: number;
}
