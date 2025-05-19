import { Module } from '@nestjs/common';
import { UsersCollabrateService } from './users-collabrate.service';
import { UsersCollabrateController } from './users-collabrate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersCollaborate } from './entities/users-collabrate.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsersCollaborate])],
  controllers: [UsersCollabrateController],
  providers: [UsersCollabrateService],
  exports:[UsersCollabrateService]
})
export class UsersCollabrateModule {}
