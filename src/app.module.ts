/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { TokensModule } from './tokens/tokens.module';
import { QueueModule } from './queue/queue.module';
import { CloudinaryModule } from './utils/cloudinary/cloudinary.module';
import {  ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './coustume.gaurd';
import { PostModule } from './post/post.module';
import { CompanyModule } from './company/company.module';
import { CompanyAssesmentModule } from './company-assesment/company-assesment.module';
import { AssesmentParticipantModule } from './assesment-participant/assesment-participant.module';
import { PostInteractionModule } from './post-interaction/post-interaction.module';


@Module({
  imports: [ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,
    }]),
    TypeOrmModule.forRoot({
      type: "postgres", 
      host: process.env.DB_HOST,
      url: process.env.DATABASE_URL,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNC === 'true', 
      logging: process.env.DB_LOGGING === 'true', 
      ssl: process.env.DB_SSL === 'true', 
      extra: process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : undefined, 
    }),
    QueueModule,
    UserModule,
    AuthModule,
    EmailModule,
    TokensModule,
    QueueModule,
    CloudinaryModule,
    PostModule,
   
    CompanyModule,
    CompanyAssesmentModule,
    AssesmentParticipantModule,
    PostInteractionModule,
 
      
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_GUARD,
    useClass: CustomThrottlerGuard, 
  },]
})
export class AppModule {}
