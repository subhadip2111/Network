import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn, Index } from "typeorm";

@Entity('post_interests')
@Index(['postId', 'interestedUserId'], { unique: true })
export class PostInterest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Post, (post) => post.interestedUsers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;
    @Column()
    postId: string;

    @ManyToOne(() => User, (user) => user.interestedPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'interestedUserId' })
    user: User;
    @Column()
    interestedUserId: string; 

    @CreateDateColumn()
    createdAt: Date;
}
