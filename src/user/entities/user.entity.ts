
import { PostInterest } from 'src/post-interests/entities/post-interest.entity';
import { Post } from 'src/post/entities/post.entity';
import { Token } from 'src/tokens/entities/token.entity';
import { UserType } from 'src/utils/enum';
import {
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.STUDENT })
  role: string;

  @Column({ type: 'json', default: [] })
  skills: string[];

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  githubProfile: string;

  @Column({ nullable: true })
  otp: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @OneToMany(()=>PostInterest, (postInterest) => postInterest.user)
  interestedPosts: PostInterest[];
                         
  //   @ManyToMany(() => Project, (project) => project.members)
  //   projects: Project[];

  //   @OneToMany(() => Comment, (comment) => comment.user)
  //   comments: Comment[];

  //   @ManyToMany(() => User, (user) => user.following)
  //   @JoinTable()
  //   followers: User[];

  //   @ManyToMany(() => User, (user) => user.followers)
  //   following: User[];

  @OneToMany(() => Token, (token) => token.userId, { cascade: true }) // One User can have multiple Tokens
  tokens: Token[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
