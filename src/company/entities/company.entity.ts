import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CompanyAssessment } from 'src/company-assesment/entities/company-assesment.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  name: string;

  @Column({ nullable: true })
  legalName: string;

  @Column({ unique: true, nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  zipCode: string;
  @Column('text', { array: true, nullable: true })
  techStack: string[];

  @Column({
    type: 'enum',
    enum: ['product', 'service', 'both'],
    default: 'service',
  })
  businessType: 'product' | 'service' | 'both';

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  logo?: string;

  @Column({ type: 'date', nullable: true })
  incorporationDate: Date;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  registrationCertificateUrl: string;

  @Column('text', { array: true, nullable: true })
  additionalDocumentsUrls: string[];

  @Column({ nullable: true })
  gstNumber?: string;

  @Column({ nullable: true })
  panNumber?: string;

  @Column({ nullable: true })
  cinNumber?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  @OneToMany(() => CompanyAssessment, (assessment) => assessment.company, {
    cascade: true,
  })
  assessments: CompanyAssessment[];
}
