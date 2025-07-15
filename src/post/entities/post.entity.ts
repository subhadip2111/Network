import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
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
  @Column({ type: 'text', default: '' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) 
  user: User;

  @Column({ type: 'uuid' }) 
  userId: string; 
  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.IDEA,
  })
  type: PostType;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column('text', { default: '' })
  imageUrls: string;

  @Column({ type: 'text', nullable: true })
  videoUrl: string;


  @Column({ type: 'int', nullable: true, default: 0 })
  likeCount: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  collaboratorCount: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  supportCount: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  insightfulCount: number;
  
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
