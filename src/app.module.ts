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
import { PostInterestsModule } from './post-interests/post-interests.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { CompanyModule } from './company/company.module';
import { CompanyAssesmentModule } from './company-assesment/company-assesment.module';

@Module({
  imports: [ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,
    }]),
    TypeOrmModule.forRoot({
      type: "postgres", // Ensure it's a valid type (e.g., 'postgres')
      host: process.env.DB_HOST,
      url: process.env.DATABASE_URL,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNC === 'true', // Boolean flag from .env
      logging: process.env.DB_LOGGING === 'true', // Enable logging conditionally
      ssl: process.env.DB_SSL === 'true', // Enable SSL conditionally
      extra: process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : undefined, // SSL Config
    }),
    
    // BullModule.forRoot({
    //   redis: {
    //     host: process.env.REDIS_HOST,
    //     port: parseInt(process.env.REDIS_PORT, 10),
    //     username: process.env.REDIS_USERNAME || undefined, // Ensure it's optional
    //     password: process.env.REDIS_PASSWORD || undefined, // Ensure it's optional
    //     tls: process.env.REDIS_TLS === 'true' ? {} : undefined, // Enable TLS conditionally
    //     maxRetriesPerRequest: 5, // Reduce retry attempts
    //     retryStrategy(times) {
    //       if (times >= 10) return null; // Stop retrying after 10 attempts
    //       return Math.min(times * 50, 2000); // Exponential backoff
    //     },
    //   },
    // }),
    QueueModule,
    
    UserModule,
    AuthModule,
    EmailModule,
    TokensModule,
    QueueModule,
    CloudinaryModule,
    PostModule,
    PostInterestsModule,
    PostLikesModule,
    CompanyModule,
    CompanyAssesmentModule
    


  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_GUARD,
    useClass: CustomThrottlerGuard, // ✅ This is the correct way
  },]
})
export class AppModule {}
