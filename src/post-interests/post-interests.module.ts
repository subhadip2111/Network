import { Module } from '@nestjs/common';
import { PostInterestsService } from './post-interests.service';
import { PostInterestsController } from './post-interests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostInterest } from './entities/post-interest.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PostInterest])],
  controllers: [PostInterestsController],
  providers: [PostInterestsService],
})
export class PostInterestsModule {}
