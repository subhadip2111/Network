import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { PostType } from '../entities/post.entity';

export class UpdatePostDto {
      @IsOptional()
      @IsString()
      content: string;

      @IsEnum(PostType)
      @IsOptional()
      type: PostType;

      @IsOptional()
      @IsString()
      title: string;


      @IsOptional()
      @IsUrl()
      imageUrls: string;

      @IsOptional()
      @IsUrl()
      videoUrl: string | null;
}
