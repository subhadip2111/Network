/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { TokensService } from 'src/tokens/tokens.service';
import {
  CreateUserDto,
  GenerateNewToken,
  LogOutDto,
  VerifyOtp,
} from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { JwtAuthGuard } from './gaurds/jwt.authGaurds';
import { QueueService } from 'src/queue/queue.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') // Tag for this controller
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,

    private readonly emailService: EmailService,
    private readonly tokenService: TokensService,
    private readonly queueService:QueueService
  ) {}

  @Post('login')
  async registerUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    await this.queueService.sendEmailJob(user.email, user.otp)
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'login  SuccessFully',
      user,
    );
  }

  @HttpCode(200)
  @Post('verify')
  async verifyOtp(@Body() dto: VerifyOtp) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.otp !== dto.otp) {
      throw new HttpException('Invalid email or otp', HttpStatus.BAD_REQUEST);
    }
    const verifyUser = await this.userService.verifyOtp(user);
    const { accessToken, refreshToken } =
      await this.tokenService.generateToken(verifyUser);
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'otp verified SuccessFully',
      { ...verifyUser, accessToken, refreshToken },
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('generatenewtoken')
  async genrateNewTokens(@Request() req: any, @Body() dto: GenerateNewToken) {
    const { accessToken, refreshToken } = await this.tokenService.generateToken(
      req.user,
    );
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'token generated SuccessFully',
      { accessToken, refreshToken },
    );
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Body() logoutDto: LogOutDto) {
    const res = await this.tokenService.logOut(logoutDto.refreshToken);
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'Logout Successfully',
      res,
    );
  }
}
