import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum TokenOwnerType {
  USER = 'user',
  COMPANY = 'company',
}

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Polymorphic relation
  @Column({ type: 'uuid' })
  ownerId: string; // Can be User ID or Company ID

  @Column({ type: 'enum', enum: TokenOwnerType })
  ownerType: TokenOwnerType; // To distinguish between User or Company

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
