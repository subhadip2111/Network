/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt.authGaurds';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/utils/cloudinary/uploads.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('User') // Tag for this controller
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findOne(@Request() req: any, @Param('userId') id: string) {
    if (req.user.id !== id) {
      throw new HttpException('Access Denied!', HttpStatus.FORBIDDEN);
    }
    const user = await this.userService.findOne(req.user.id);
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'Profile Details  Get Successfully',
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId')
  async update(
    @Request() req: any,
    @Param('userId') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.id !== id) {
      throw new HttpException('Access Denied!', HttpStatus.FORBIDDEN);
    }
    return await this.userService.update(req.user.id, updateUserDto);
  }

  @Post('/image/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return { url: result.secure_url };
  }

  @Delete(':userId')
  async remove(@Param('userId') id: string) {
    return await this.userService.remove(id);
  }
}
