import { Module } from '@nestjs/common';
import { PostInteractionService } from './post-interaction.service';
import { PostInteractionController } from './post-interaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostInteraction } from './entities/post-interaction.entity';
import { PostModule } from 'src/post/post.module';

@Module({
  imports:[TypeOrmModule.forFeature([PostInteraction]),PostModule],
  controllers: [PostInteractionController],
  providers: [PostInteractionService],
})
export class PostInteractionModule {}
