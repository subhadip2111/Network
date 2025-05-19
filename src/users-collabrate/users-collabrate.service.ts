import { Injectable } from '@nestjs/common';
import { CreateUsersCollabrateDto } from './dto/create-users-collabrate.dto';
import { UpdateUsersCollabrateDto } from './dto/update-users-collabrate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersCollaborate } from './entities/users-collabrate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersCollabrateService {
  constructor(@InjectRepository(UsersCollaborate) private readonly collabRepo:Repository<UsersCollaborate> ){}
async   create(createUsersCollabrateDto: CreateUsersCollabrateDto) {
   const saveCollabInfo=await this.collabRepo.create(createUsersCollabrateDto);
   await this.collabRepo.save(saveCollabInfo);
   return this.collabRepo;
  }
  async getAllCollabRequest(userId: string, query: any) {
    const collabRequestList = await this.collabRepo
      .createQueryBuilder('userCollaborators')
      .where('userCollaborators.userId = :userId', { userId })
      .orWhere('userCollaborators.status = :status', { status: query.status })
      .orderBy('userCollaborators.updatedAt', 'DESC')
      .getMany();
  
    return collabRequestList;
  }
  

 async  findOne(id: string) {
    const collabInfo=await this.collabRepo.findOne({where:{id:id}})
    return collabInfo;
  }

  async update(id: string, updateUsersCollabrateDto: UpdateUsersCollabrateDto) {
    const collabInfo=await this.findOne(id);
    Object.assign(collabInfo,updateUsersCollabrateDto);
    await this.collabRepo.save(collabInfo);
    return collabInfo;
   
  }

  
}
