import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ApiErrorResponse } from 'src/utils/ApiSuccesResponse';

@Injectable()
export class MessagesService {
  constructor (@InjectRepository(Message) private readonly messageRepo: Repository<Message> ){

  }
  async sendMessageToTheGroup({
    groupId,
    message,
    senderId,
  }: {
    groupId: string;
    message: string;
    senderId: string;
  }) {
    const newMessage = this.messageRepo.create({
      groupId,
      message,
      senderId,
    });
  
    const savedMessage = await this.messageRepo.save(newMessage);
    return savedMessage;
  }
  

  async getAllMessagesOfGroup(groupId: string) {
    const messages = await this.messageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.senderId', 'sender') 
      .where('message.groupId = :groupId', { groupId })
      .orderBy('message.sentAt', 'DESC')
      .select([
        'message.id',
        'message.message',
        'message.sentAt',
        'sender.id',
        'sender.fullName',
        'sender.profilePicture',
      ])
      .getMany();
  
    return messages;
  }
  

  async findOne(id: string) {
    const message=await this.messageRepo.findOne({where:{id:id}});
    return message;
  }

  async  update(id: string, updateMessageDto: UpdateMessageDto) {
    const message=await this.findOne(id);
    if(!message){throw new ApiErrorResponse(HttpStatus.NOT_FOUND,false,'invaild messageId')}
    Object.assign(message,updateMessageDto);
    await this.messageRepo.save(message);
    return message
  }

  async remove(id: string) {
    const message = await this.messageRepo.findOne({ where: { id } });
  
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
  
    await this.messageRepo.remove(message);
  
    return message
  }
  
}
