import { PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateMessageDto  {
    messageId:string
    message:string
    senderId:string
}

