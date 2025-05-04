import { Injectable } from '@nestjs/common';
import { companyRegisterDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CompanyProfileDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private readonly comapnyRepo: Repository<Company>) { }
  async register(createCompanyDto: companyRegisterDto) {
    const company = await this.comapnyRepo.create(createCompanyDto);
    await this.comapnyRepo.save(company);
    return company;
  }

  async login(company: any, password: string) {

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    return company;
  }

  async findAll(query: QueryCompanyDto) {
    const { page = 1, limit = 10, keywords = '' } = query;
    const skip = (page - 1) * limit;
    const take = limit;
  
    const where: any = [];
  
    if (keywords) {
      const lowerKeyword = `%${keywords.toLowerCase()}%`;
      where.push(
        { name: ILike(lowerKeyword) },
        { legalName: ILike(lowerKeyword) },
        { city: ILike(lowerKeyword) },
        { country: ILike(lowerKeyword) },
        {techStack: ILike(lowerKeyword) },

      );
    }
  
    const [companies, total] = await this.comapnyRepo.findAndCount({
      where: keywords ? where : undefined,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  
    const totalPages = Math.ceil(total / limit);
  
    return {
      companies,
      total,
      totalPages,
      currentPage: page,
    };
  }
  

  async updateCompanyDetails(company:any, companyDetails: CompanyProfileDto) {
 
    Object.assign(company, companyDetails);
    await this.comapnyRepo.save(company);
    return company;

  }

 async findOne(id: string) {
    const company = await this.comapnyRepo.findOne({ where: { id: id } });
   return company;
  }

  async getCompanyByEmail(email: string) {
    const company = await this.comapnyRepo.findOne({ where: { email:email } });
    return company;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
