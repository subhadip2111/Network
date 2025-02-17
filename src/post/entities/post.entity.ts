import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export enum PostType {
    IDEA = 'idea',
    QUERY = 'query',
    RESOURCES = 'resources',
    PRODUCT_DEMO = 'product_demo',
  }
  
  @Entity('posts')
  export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'text' })
    content: string;
  
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({
      type: 'enum',
      enum: PostType,
      default: PostType.IDEA,
    })
    type: PostType;
  
    @Column({ type: 'boolean', default: false })
    isVerified: boolean;
  
    @Column('simple-array', { default: [] })
    imageUrls: string[];
  
    @Column({ type: 'text', nullable: true })
    videoUrl: string | null;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  }
  