import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';

export class AssessmentQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    type: Number,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Limit of items per page',
    required: false,
    type: Number,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Search keyword for filtering assessments by title or description',
    required: false,
    type: String,
    example: 'frontend',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'Start date to filter assessments (inclusive)',
    required: false,
    type: String,
    format: 'date-time',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiProperty({
    description: 'End date to filter assessments (inclusive)',
    required: false,
    type: String,
    format: 'date-time',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
