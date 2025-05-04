/* eslint-disable prettier/prettier */


import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const oldUser = await this.findUserByEmail(createUserDto.email);
    const otp = Math.floor(100000 + Math.random() * 900000);
    if (oldUser) {
      oldUser.otp = otp.toString();
      await this.userRepo.save(oldUser);
      return oldUser;
    } else {
      const user = this.userRepo.create(createUserDto);
      user.otp = otp.toString();
      await this.userRepo.save(user);
      return user;
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email: email } });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    return user;
  }

 async verifyOtp(user: any) {
  user.otp = null; 
  await this.userRepo.save(user);
  return user
}


  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id);
    Object.assign(user, updateUserDto);
    await this.userRepo.save(user);
    return user;
  }

  async remove(id: string) {
    return await this.userRepo.findOneByOrFail({ id: id });
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id :id} });
    return user;
  }
}
