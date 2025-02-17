import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePostDto {
      @IsOptional() 
      @IsArray() 
      @IsString({ each: true }) 
      imageUrls: string[];
    
      @IsOptional() 
      @IsUrl() 
      videoUrl: string | null;
}
