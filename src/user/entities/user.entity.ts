import { Post } from "@nestjs/common";
import { CreateDateColumn, OneToMany, ManyToMany, Column, Entity, JoinTable, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'enum', enum: ['STUDENT', 'DEVELOPER', 'INVESTOR', 'COMPANY'], default: 'STUDENT' })
  role: string;

  @Column({ nullable: true })
  bio: string;

//   @OneToMany(() => Post, (post) => post.user)
//   posts: Post[];

//   @ManyToMany(() => Project, (project) => project.members)
//   projects: Project[];

//   @OneToMany(() => Comment, (comment) => comment.user)
//   comments: Comment[];

//   @ManyToMany(() => User, (user) => user.following)
//   @JoinTable()
//   followers: User[];

//   @ManyToMany(() => User, (user) => user.followers)
//   following: User[];

  @CreateDateColumn()
  createdAt: Date;
}


