import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

@Module({
  imports:[TypeOrmModule.forFeature([Post]),CloudinaryModule],
  controllers: [PostController],
  providers: [PostService],
  exports:[PostService]
})
export class PostModule {}
