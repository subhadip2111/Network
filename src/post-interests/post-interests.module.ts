import { Module } from '@nestjs/common';
import { PostInterestsService } from './post-interests.service';
import { PostInterestsController } from './post-interests.controller';

@Module({
  controllers: [PostInterestsController],
  providers: [PostInterestsService],
})
export class PostInterestsModule {}
