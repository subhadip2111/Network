import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CompanyAssessment } from 'src/company-assesment/entities/company-assesment.entity';
export enum AssessmentIntentStatus {
  PENDING = 'PENDING',
  REGISTERED = 'REGISTERED',
  DECLINED = 'DECLINED',
  COMPLETE = 'COMPLETE'
}
@Entity('assessment_participants')
export class AssessmentParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompanyAssessment, (assessment) => assessment.participants, { onDelete: 'CASCADE' })
  assessment: CompanyAssessment;
  @Column()
  assessmentId: string;

  @ManyToOne(() => User, (user) => user.assessmentParticipants, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: AssessmentIntentStatus, default: AssessmentIntentStatus.PENDING })
  status: AssessmentIntentStatus;

  @Column({ default: false })
  hasSubmitted: boolean;

  @Column({ type: 'int', nullable: true })
  score?: number;

  @Column('text', { nullable: true })
  submissionLink?: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
