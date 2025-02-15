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

@Module({
  imports: [UserModule, QueueModule, PassportModule, TokensModule, EmailModule, JwtModule.register({
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
