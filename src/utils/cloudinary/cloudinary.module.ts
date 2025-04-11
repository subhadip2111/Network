/* eslint-disable prettier/prettier */



import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './uploads.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService], // Export to use in other modules
})
export class CloudinaryModule {}
