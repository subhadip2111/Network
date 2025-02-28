import { PartialType } from '@nestjs/mapped-types';
import { CreatePostInterestDto } from './create-post-interest.dto';

export class UpdatePostInterestDto extends PartialType(CreatePostInterestDto) {}
