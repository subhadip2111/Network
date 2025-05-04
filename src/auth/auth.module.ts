/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { EmailModule } from 'src/email/email.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { QueueModule } from 'src/queue/queue.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [UserModule, QueueModule,CompanyModule, PassportModule, TokensModule, EmailModule, JwtModule.register({
      secret: process.env.secret,
      signOptions: {
        expiresIn: process.env.expireIn,
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
