import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' }) // A user can have multiple tokens
  userId: User;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
