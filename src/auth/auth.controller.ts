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

  LogOutDto,
  VerifyOtp,
} from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';
import { JwtAuthGuard } from './gaurds/jwt.authGaurds';
import { QueueService } from 'src/queue/queue.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from 'src/company/dto/create-company.dto';
import { CompanyService } from 'src/company/company.service';
import { TokenOwnerType } from 'src/tokens/entities/token.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,

    private readonly emailService: EmailService,
    private readonly tokenService: TokensService,
    private readonly queueService: QueueService,
    private readonly companyService: CompanyService,
  ) { }

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
      await this.tokenService.generateToken(verifyUser, TokenOwnerType.USER);
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
  async genrateNewTokens(@Request() req: any, ) {
    const { accessToken, refreshToken } = await this.tokenService.generateToken(
      req.user, TokenOwnerType.USER
    );
    return new ApiSuccessResponse(
      HttpStatus.OK,
      true,
      'token generated Successfully',
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

  @HttpCode(200)
  @Post('company/register')
  async register(@Body() dto: RegisterDto) {
    const existCompany = await this.companyService.getCompanyByEmail(dto.email);
    if (existCompany) {
      throw new ApiErrorResponse(
        HttpStatus.BAD_REQUEST,
        false,
        'Company already exists',
        null
      );
    }
    const company = await this.companyService.register(dto);
    return new ApiSuccessResponse(
      HttpStatus.CREATED,
      true,
      'Company registered successfully',
      company
    );
  }

  @HttpCode(200)
  @Post('company/login')
  async login(@Body() dto: LoginDto) {
    const existCompany = await this.companyService.getCompanyByEmail(dto.email);
    if (!existCompany) {
      throw new ApiErrorResponse(HttpStatus.BAD_REQUEST, false, 'Company not found', existCompany)
    }
    const company = await this.companyService.login(existCompany, dto.password);
    if (!company) {
      throw new ApiErrorResponse(HttpStatus.BAD_REQUEST, false, 'Invalid credentials', company)
    }
    const { accessToken, refreshToken } = await this.tokenService.generateToken(company,  TokenOwnerType.COMPANY);
    return new ApiSuccessResponse(HttpStatus.OK, true, 'Company login successfully',{...company,  accessToken, refreshToken } );
  }
}