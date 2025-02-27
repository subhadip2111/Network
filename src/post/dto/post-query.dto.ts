import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import { PostType } from '../entities/post.entity';

export class QueryPostDto {
    @IsEnum(PostType)
    @IsOptional()
    @IsString()
    @IsEnum(PostType)
    type: PostType;

    @IsOptional()
    @IsString()
    keyword: string;

    @IsOptional()
    @IsString()
    page: number;

    @IsOptional()
    @IsString()
    pageSize: number;
}
