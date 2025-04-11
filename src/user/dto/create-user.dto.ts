import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;
}

export class VerifyOtp {
  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: '244224',
    required: true,
  })
  otp: string;
}

export class LogOutDto {
  @ApiProperty({
    example: 'your-refresh-token',
    description: 'The refresh token to be invalidated',
    required: true,
  })
  @IsString()
  refreshToken: string;
}

export class GenerateNewToken {
  @ApiProperty({
    example: 'your-refresh-token',
    description: 'The refresh token to be invalidated',
    required: true,
  })
  accessToken: string;
}
