import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GroupsService } from 'src/groups/groups.service';
import { MessagesService } from 'src/messages/messages.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway');
  constructor(
    private readonly groupService: GroupsService,
    private readonly messageService: MessagesService,
    private readonly userService: UserService,
  ) {}

  server: Server;

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
    this.server = server;
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @MessageBody() payload: { groupId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { groupId, userId } = payload;
    try {
      const findGroup = await this.groupService.getGroupDetails(groupId);
      if (!findGroup) {
        throw new WsException('Invalid group ID');
      }

      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new WsException('Invalid user ID');
      }

      client.join(groupId);

      this.server.to(client.id).emit('joinedGroup', {
        groupId,
        message: `User ${user.fullName} joined group ${groupId}`,
      });

      this.server.to(groupId).emit('userJoinedChat', {
        groupId,
        userId,
        username: user.fullName,
        timestamp: new Date(),
      });

      this.logger.log(`User ${userId} joined group ${groupId}`);
    } catch (error) {
      this.logger.error(error.message);
      this.server.to(client.id).emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    payload: { groupId: string; message: string; senderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { groupId, message, senderId } = payload;
    try {
      const group = await this.groupService.getGroupDetails(groupId);
      if (!group) throw new WsException('Invalid group ID');

      const sender = await this.userService.findOne(senderId);
      if (!sender) throw new WsException('Invalid sender ID');

      const savedMessage = await this.messageService.sendMessageToTheGroup({
        groupId,
        message,
        senderId,
      });

      this.server.to(groupId).emit('receiveMessage', {
        ...savedMessage,
        senderUsername: sender.fullName,
        timestamp: savedMessage.createdAt || new Date(),
      });

      this.logger.log(
        `Message from ${sender.fullName} to group ${groupId}: ${message}`,
      );
    } catch (error) {
      this.logger.error(error.message);
      this.server.to(client.id).emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('getLatestMessages')
  async handleGetLatestMessages(
    @MessageBody() payload: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { groupId } = payload;
      const group = await this.groupService.getGroupDetails(groupId);
      if (!group) throw new WsException('Invalid group ID');

      const messages = await this.messageService.getAllMessagesOfGroup(groupId);

      this.server.to(client.id).emit('latestMessages', messages);
    } catch (error) {
      this.logger.error(error.message);
      this.server.to(client.id).emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @MessageBody()
    payload: { messageId: string; message: string; senderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { messageId } = payload;
      const findMessage=await this.messageService.findOne(messageId);
      if(!findMessage){
        throw new WsException('Message not found!');
      }
      const updatedMessage = await this.messageService.update(messageId,
        payload
        
      );

      this.server.to(client.id).emit('messageUpdated', updatedMessage);
    } catch (error) {
      this.logger.error(error.message);
      this.server.to(client.id).emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() payload: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { messageId } = payload;
     
      const result = await this.messageService.remove(
        messageId
      );

      this.server.to(client.id).emit('messageDeleted', {
        messageId,
        status: 'deleted',
      });

      this.logger.log(
        `Message ${messageId} deleted  ${result}`,
      );
    } catch (error) {
      this.logger.error(error.message);
      this.server.to(client.id).emit('error', {
        message: error.message,
      });
    }
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(
    @MessageBody() payload: { groupId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { groupId, userId } = payload;
    try {
      client.leave(groupId);

      const user = await this.userService.findOne(userId);

      this.server.to(client.id).emit('leftGroup', {
        groupId,
        message: `User ${user?.fullName || userId} left group ${groupId}`,
      });

      this.server.to(groupId).emit('userLeftChat', {
        userId,
        username: user?.fullName || `User_${userId}`,
        groupId,
        timestamp: new Date(),
      });

      this.logger.log(`User ${userId} left group ${groupId}`);
    } catch (error) {
      this.logger.error(error.message);
      this.server.to(client.id).emit('error', {
        message: error.message,
      });
    }
  }
}
