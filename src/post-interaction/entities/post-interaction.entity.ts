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
import { ReactionType } from '../dto/create-post-interaction.dto';
export enum InteractionType {
    LIKE = 'like',
    LOVE = 'love',
    CELEBRATE = 'celebrate',

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

    @Column({ type: 'enum', enum: ReactionType })
    type: ReactionType;

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'postId' })
    post: Post;
    @Column()
    postId: string;

    @CreateDateColumn()
    createdAt: Date;
}
