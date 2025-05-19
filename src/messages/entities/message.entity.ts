// message.entity.ts
import { Group } from 'src/groups/entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';

  @Entity('messages')
  export class Message {
    @PrimaryGeneratedColumn()
    id: string;
  
    @ManyToOne(() => Group, (group) => group.messages)
    groupId: string;
  
    @ManyToOne(() => User, { eager: true })
    senderId: string;
  
    @Column('text') 
    message: string;
  
    
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    sentAt: Date;
  
    @Column({ default: false })
    read: boolean; 

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      createdAt: Date;
    
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      updatedAt: Date;
  }
  