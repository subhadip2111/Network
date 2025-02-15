/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete,UploadedFile, UseInterceptors, UseGuards,Request, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/utils/cloudinary/uploads.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

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

  // @UseGuards(JwtAuthGuard)
  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return { url: result.secure_url };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  
}
