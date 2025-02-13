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
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cul37323esus73b37k90-a.oregon-postgres.render.com',
      port: 5432,
      username: 'subhadip',
      password: 'fiF2lyv3HNq49f8BUw0xMKaKSxQfYqKU',
      database: 'networkdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      ssl: true,  // Required for Render-hosted PostgreSQL
      extra: {
        ssl: {
          rejectUnauthorized: false, // For self-signed certificates
        },
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        username: process.env.REDIS_USERNAME, // Username from .env
        password: process.env.REDIS_PASSWORD, // Password from .env
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined, // Enable TLS only if true
      },
    }),
    
    UserModule,
    AuthModule,
    EmailModule,
    TokensModule,
    QueueModule
    


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
