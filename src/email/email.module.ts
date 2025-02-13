import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure environment variables are loaded
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('NODE_MAILER_HOST'),
          port: configService.get<number>('NODE_MAILER_PORT', 587), // Default to 587
          secure: configService.get<string>('NODE_MAILER_PORT') === '465', // true for 465, false for 587/2525
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
