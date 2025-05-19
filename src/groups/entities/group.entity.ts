// group.entity.ts
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
//   import { Message } from './message.entity';

  @Entity('groups')
  export class Group {
    @PrimaryGeneratedColumn()
    id: string;
  
    @Column()
    name: string;
    @Column({default:""})
    image: string;
    

 
    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'createdBy' }) 
    createdByUser: User;
  
    @Column({nullable:true})
    createdBy: string;
  
    @ManyToMany(() => User, (user) => user.groups, { eager: true })
    @JoinTable() 
    members: User[];
  
    @OneToMany(() => Message, (message) => message.groupId, { cascade: true })
    messages: Message[];
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  }
   