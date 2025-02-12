import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

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
    UserModule
    


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
