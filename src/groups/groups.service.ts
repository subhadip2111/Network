import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { And, In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GroupsService {
  constructor(@InjectRepository(Group) private readonly groupRepo :Repository<Group> ,
  @InjectRepository(User) private readonly userRepo :Repository<User>,
  private readonly userService:UserService
){}
  async createGroup(createGroupDto: CreateGroupDto) {
    const memberIds = new Set(createGroupDto.members || []);
    memberIds.add(createGroupDto.memberId);
      const members = await this.userRepo.findBy({
      id: In(Array.from(memberIds)),
    });
  
    const group = this.groupRepo.create({
      name: createGroupDto.name,
      members: members,
      createdBy:createGroupDto.createdBy
    });
  
     const ans=await this.groupRepo.save(group);
     return ans
  }
  

  async getAllOfMyGroups(query: any) {
    const userId = query.userId;
  
    const myGroups = await this.groupRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.members', 'member')
      .where('member.id = :userId', { userId })
      .getMany();
  
    return myGroups;
  }
  

 async  getGroupDetails(id: string) {
    const groups=await this.groupRepo.findOneBy({id:id});
    return  groups;
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto) {
    const groupInfo = await this.groupRepo.findOne({
      where: { id },
      relations: ['members'], 
    });
  
    if (!groupInfo) {
      throw new NotFoundException('Group not found');
    }
  
    if (updateGroupDto.members && updateGroupDto.members.length) {
      const users = await this.userRepo.findBy({
        id: In(updateGroupDto.members),
      });
      groupInfo.members = users;
    }
  
    Object.assign(groupInfo, updateGroupDto);
  
    const updatedGroup = await this.groupRepo.save(groupInfo);
    return updatedGroup;
  }

  async addMembers(groupId: string, dto: UpdateGroupDto) {
    const group = await this.getGroupDetails(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
  
    const existingMemberIds = group.members.map((member) => member.id);
  
    for (const id of dto.members) {
      if (existingMemberIds.includes(id)) {
        throw new BadRequestException(`User with ID ${id} is already in the group`);
      }
    }
  
    const newMembers = await Promise.all(
      dto.members.map((id) => this.userService.getUserById(id))
    );
  
    group.members.push(...newMembers);
  
    const { members, ...rest } = dto;
    Object.assign(group, rest);
  
    await this.groupRepo.save(group);
    return group;
  }
  
  async removeMembers(groupId: string, memberIdsToRemove: string[]) {
    const group = await this.getGroupDetails(groupId);
  
    if (!group) {
      throw new NotFoundException('Group not found');
    }
  
    if (!group.members || group.members.length === 0) {
      throw new BadRequestException('Group has no members to remove');
    }
  
    group.members = group.members.filter(
      (member) => !memberIdsToRemove.includes(member.id)
    );
  
    await this.groupRepo.save(group);
  
    return {
      message: 'Members removed successfully',
      group,
    };
  }
  

 async deleteGroup(id: string) {
  const group = await this.groupRepo.findOneBy({ id });
  if (!group) {
    throw new NotFoundException(`Group with ID ${id} not found`);
  }

  await this.groupRepo.remove(group);
  }
}
