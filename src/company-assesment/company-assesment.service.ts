import { Injectable } from '@nestjs/common';
import { CreateCompanyAssessmentDto } from './dto/create-company-assesment.dto';
import { UpdateCompanyAssesmentDto } from './dto/update-company-assesment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyAssessment } from './entities/company-assesment.entity';
import { Between, Repository } from 'typeorm';
import { AssessmentQueryDto } from './dto/assesment.query.dto';

@Injectable()
export class CompanyAssesmentService {
  constructor(@InjectRepository(CompanyAssessment) private readonly companyAssesmentRepo: Repository<CompanyAssessment>) { }
  async createAssesment(createCompanyAssesmentDto: CreateCompanyAssessmentDto) {
    const companyAssesment = await this.companyAssesmentRepo.create(createCompanyAssesmentDto);
    await this.companyAssesmentRepo.save(companyAssesment);
    return companyAssesment;
  }
  async findAllAssesments(query: AssessmentQueryDto) {
    try {
      const { page = 1, limit = 10, keyword = '', fromDate, toDate } = query;

      const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
      const fromDateTime = fromDate ? new Date(fromDate) : startOfDay;
      const toDateTime = toDate ? new Date(toDate) : endOfDay;
      const skip = (page - 1) * limit;
      const take = limit;
      const queryBuilder = this.companyAssesmentRepo.createQueryBuilder('company_assessments')
        .leftJoinAndSelect('company_assessments.company', 'company') 
        .where('company_assessments.createdAt BETWEEN :fromDate AND :toDate', {
          fromDate: fromDateTime,
          toDate: toDateTime,
        });

      if (keyword) {
        queryBuilder.andWhere(
          '(company_assessments.position ILIKE :keyword OR company_assessments.description ILIKE :keyword)',
          { keyword: `%${keyword}%` }
        );
      }

      queryBuilder.skip(skip).take(take);
      queryBuilder.orderBy('company_assessments.createdAt', 'DESC'); 

      const assessments = await queryBuilder.getMany();

      const totalAssessments = await this.companyAssesmentRepo.count({
        where: {
          createdAt: Between(fromDateTime, toDateTime),
        },
      });

      const totalPages = Math.ceil(totalAssessments / limit);

      return {
        data: assessments.map(assessment => ({
          ...assessment,
          company: {
            name: assessment.company.name,
            logo: assessment.company.logo,
          },
        })),
        total: totalAssessments,
        totalPages,
        currentPage: page,
        limit,
      };
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw new Error('Could not fetch assessments at this time. Please try again later.');
    }
  }

  async getDetailsById(id: string) {
    const companyAssesment = await this.companyAssesmentRepo.findOne({ where: { id } ,relations: ['company'], });
    return companyAssesment;
  }

  async update(assesment: any, updateCompanyAssesmentDto: UpdateCompanyAssesmentDto) {
    Object.assign(assesment, updateCompanyAssesmentDto);
    await this.companyAssesmentRepo.save(assesment);
    return assesment;

  }
  async findAllByCompanyId(companyId: string) {
    const assessments = await this.companyAssesmentRepo.find({
      where: { companyId: companyId },
      order: {
        createdAt: 'DESC',
      },
    });
    return assessments;
  }

  async remove(id: string) {
    const assesment = await this.companyAssesmentRepo.findOne({ where: { id } });
    if (!assesment) {
      throw new Error('Company assessment not found');
    }
    await this.companyAssesmentRepo.remove(assesment);
    return assesment;
  }
}
