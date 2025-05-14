import { Module } from '@nestjs/common';
import { PostInteractionService } from './post-interaction.service';
import { PostInteractionController } from './post-interaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostInteraction } from './entities/post-interaction.entity';
import { PostModule } from 'src/post/post.module';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PostInteraction,Post]),PostModule],
  controllers: [PostInteractionController],
  providers: [PostInteractionService],
  exports:[PostInteractionService]
})
export class PostInteractionModule {}
