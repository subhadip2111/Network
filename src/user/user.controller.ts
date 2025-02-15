import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
 async  findOne(@Request() req:any,@Param('id') id: string) {
  if(req.user.id!==id){
    throw new HttpException('Access Denied!', HttpStatus.FORBIDDEN);
  }
  const user= await   this.userService.findOne(req.user.id);
  return new ApiSuccessResponse(HttpStatus.OK,true,'Profile Details  Get Successfully',user)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
 async  update(@Request() req:any,@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  if(req.user.id!==id){
    throw new HttpException('Access Denied!', HttpStatus.FORBIDDEN);
  }
  console.log(id)
    return  await this.userService.update(req.user.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  
}
