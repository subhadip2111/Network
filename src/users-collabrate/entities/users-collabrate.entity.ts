import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Post } from "src/post/entities/post.entity";

export enum STATUS {
    ACCEPTED = 'accepted',
    PENDING = 'pending',
    REJECTED = 'rejected',
}
@Entity('userCollaborators')
export class UsersCollaborate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { eager: true })
    user: User;
    @Column('uuid')
    userId: string;

    @ManyToOne(() => User, { eager: true })
    collaborator: User;
    @Column('uuid')
    colabratorId: string;


    @ManyToOne(() => Post, { eager: true })
    post: Post;
    @Column('uuid')
    postId: string;

    @Column({ type: 'enum', enum: STATUS, default: STATUS.PENDING})
    status: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
