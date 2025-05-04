import { Injectable } from '@nestjs/common';
import { CreateAssesmentParticipantDto } from './dto/create-assesment-participant.dto';
import { UpdateAssesmentParticipantDto } from './dto/update-assesment-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AssessmentParticipant } from './entities/assesment-participant.entity';
import { Repository } from 'typeorm';
import { QueueService } from 'src/queue/queue.service';
import { queryAssesmentParticipantDto } from './dto/assesmentParticipant.dto';

@Injectable()
export class AssesmentParticipantService {
  constructor(@InjectRepository(AssessmentParticipant) private readonly assesmentparticipantRepo: Repository<AssessmentParticipant>,
  ) { }

  async showInterestInAssesment(createAssesmentParticipantDto: CreateAssesmentParticipantDto) {

    const assesmentParticipant = await this.assesmentparticipantRepo.create(createAssesmentParticipantDto);

    await this.assesmentparticipantRepo.save(assesmentParticipant);

    return assesmentParticipant;
  }

  async getAllMyAssesments(query: queryAssesmentParticipantDto) {
    const { page = 1, limit = 10, keyword = '' } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const queryBuilder = await this.assesmentparticipantRepo.createQueryBuilder('assesment_participant')
      .leftJoinAndSelect('assesment_participant.assessment', 'assessment')
      .leftJoinAndSelect('assessment.company', 'company')
      .leftJoinAndSelect('assesment_participant.user', 'user')
      .where('assesment_participant.userId = :userId', { userId: query.userId });

    if (keyword) {
      queryBuilder.andWhere(
        '(assessment.position ILIKE :keyword OR assessment.description ILIKE :keyword OR company.name ILIKE :keyword)',
        { keyword: `%${keyword}%` }
      );
    }

    queryBuilder.skip(skip).take(take);
    queryBuilder.orderBy('assesment_participant.createdAt', 'DESC');

    const assesments = await queryBuilder.getMany();

    const totalAssessments = await this.assesmentparticipantRepo.count({
      where: {
        userId: query.userId,
      },
    });

    const totalPages = Math.ceil(totalAssessments / limit);

    return {
      data: assesments,
      totalPages,
      currentPage: page,
      totalAssessments,
    };

  }

  async viewAssesmentDetails(id: string) {
    const assesmentParticipant = await this.assesmentparticipantRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    return assesmentParticipant;
  }

  async submitAsssment(assesmentParticipant: any, updateAssesmentParticipantDto: UpdateAssesmentParticipantDto) {
    Object.assign(assesmentParticipant, updateAssesmentParticipantDto);
    await this.assesmentparticipantRepo.save(assesmentParticipant);
    return assesmentParticipant;
  }

  async getParticipantsByAssessmentId(assessmentId: string, queryObj: queryAssesmentParticipantDto,) {
    const { page = 1, limit = 10, status } = queryObj;
    const skip = (page - 1) * limit;

    const query = this.assesmentparticipantRepo
      .createQueryBuilder('assessment_participants')
      .leftJoinAndSelect('assessment_participants.user', 'user')
      .where('assessment_participants.assessmentId = :assessmentId', { assessmentId });

    if (status) {
      query.andWhere('participant.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('assessment_participants.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data,
    };
  }


  async getParticipantsByCompany(companyId: string, queryObj: queryAssesmentParticipantDto,) {
    const { page = 1, limit = 10, keyword = '', status } = queryObj;
    const skip = (page - 1) * limit;

    const query = await this.assesmentparticipantRepo
      .createQueryBuilder('assessment_participants')
      .leftJoinAndSelect('assessment_participants.user', 'user')
      .leftJoin('assessment_participants.company_assessments', 'company_assessments')
      .leftJoin('company_assessments.company', 'company')
      .where('company.id = :companyId', { companyId });

    if (keyword) {
      query.andWhere(
        '(LOWER(user.fullName) LIKE :keyword OR LOWER(user.email) LIKE :keyword)',
        { keyword: `%${keyword.toLowerCase()}%` }
      );
    }

    if (status) {
      query.andWhere('participant.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('participant.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data,
    };
  }

}
