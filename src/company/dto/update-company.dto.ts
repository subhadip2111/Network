import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,

} from 'class-validator';
import { Type } from 'class-transformer';

export class CompanyProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  incorporationDate?: Date;

  @ApiProperty()
  @IsBoolean()
  isVerified: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  registrationCertificateUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  additionalDocumentsUrls?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @ApiPropertyOptional({ enum: ['product', 'service', 'both'] })
  @IsOptional()
  @IsEnum(['product', 'service', 'both'])
  businessType?: 'product' | 'service' | 'both';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  panNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cinNumber?: string;




}
