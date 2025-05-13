import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
export enum InteractionType {
    LIKE = 'like',
    LOVE = 'love',
    COLLABORATE = 'collaborate',
}

@Entity('postInteractions')
export class PostInteraction {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: string;

    @Column({ type: 'enum', enum: InteractionType })
    type: InteractionType;

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'postId' })
    post: Post;
    @Column()
    postId: string;

    @CreateDateColumn()
    createdAt: Date;
}
