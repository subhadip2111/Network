import { PartialType } from '@nestjs/swagger';
import { CreatePostInteractionDto } from './create-post-interaction.dto';

export class UpdatePostInteractionDto extends PartialType(CreatePostInteractionDto) {}
