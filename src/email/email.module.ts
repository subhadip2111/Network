import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('NODE_MAILER_HOST'),
          port: configService.get<number>('NODE_MAILER_PORT', 587), 
          secure: configService.get<string>('NODE_MAILER_PORT') === '465', 
          auth: {
            user: configService.get<string>('NODE_MAILER_USER'),
            pass: configService.get<string>('NODE_MAILER_PASSWORD'),
          },
        },
        defaults: {
          from: `"Network Team" <${configService.get<string>('NODE_MAILER_USER')}>`,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
