import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { GroupsModule } from 'src/groups/groups.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[GroupsModule,MessagesModule,UserModule],
  controllers: [],
  providers: [ChatGateway],
  exports:[]
})
export class ChatModule {}
