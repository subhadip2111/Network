/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),CloudinaryModule ,PostModule],
  controllers: [UserController],
  providers: [UserService,],
  exports:[UserService]
})
export class UserModule {}
