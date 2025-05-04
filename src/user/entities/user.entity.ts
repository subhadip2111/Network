
import { AssessmentParticipant } from 'src/assesment-participant/entities/assesment-participant.entity';
import { PostInterest } from 'src/post-interests/entities/post-interest.entity';
import { Post } from 'src/post/entities/post.entity';
import { UserType } from 'src/utils/enum';
import {

  OneToMany,

  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @OneToMany(() => PostInterest, (postInterest) => postInterest.user)
  interestedPosts: PostInterest[];
  @OneToMany(() => AssessmentParticipant, (participant) => participant.user)
  assessmentParticipants: AssessmentParticipant[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
