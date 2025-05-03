import { Company } from 'src/company/entities/company.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CompanyAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  position: string; 

  @Column('text')
  description: string; 

  @Column('text')
  rules: string; 

  @Column({ type: 'int', nullable: true })
  durationInMinutes: number; 

  @Column('text', { nullable: true })
  figmaLink?: string; 

  @Column('text', { nullable: true })
  githubRepoLink?: string; 

  @Column('text', { nullable: true })
  referenceDocLinks?: string; 

  @Column('text')
  candidateResponsibilities: string; 

  @Column('enum', { enum: ['product', 'service', 'both'] })
  workEnvironment: 'product' | 'service' | 'both'; 
  

  @Column('text')
  assessmentDetails: string; 

  @ManyToOne(() => Company, (company) => company.assessments, { onDelete: 'CASCADE' })
  company: Company;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
