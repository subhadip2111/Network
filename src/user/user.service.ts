import { Injectable } from '@nestjs/common';
import { CreateUserDto, VerifyOtp } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Certificate } from 'crypto';

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

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    return user;
  }

 async verifyOtp(user: any) {
  user.otp = null; // Clear OTP after successful verification

  await this.userRepo.save(user);
console.log('====================================');
console.log(user);
console.log('====================================');
  return user
}


  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id);
    Object.assign(user, updateUserDto);
    await this.userRepo.save(user);
    return user;
  }

  async remove(id: number) {
    return await this.userRepo.findOneByOrFail({ id: id });
  }

  async getUserById(id: number): Promise<User | null> {
    console.log('id', id);
    const user = await this.userRepo.findOne({ where: { id } });
    console.log('user data', user);
    return user;
  }
}
