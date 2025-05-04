import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsUUID,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyAssessmentDto {
  @ApiProperty({
    description: 'Job position for which the assessment is being created',
    example: 'Frontend Developer',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    description: 'Detailed description of the assessment',
    example: 'This assessment is designed to evaluate basic frontend skills.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Rules to be followed by the candidate during the assessment',
    example: 'No external help allowed. Complete within the time limit.',
  })
  @IsString()
  @IsNotEmpty()
  rules: string;

  @ApiProperty({
    description: 'Duration of the assessment in minutes',
    example: 90,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  durationInMinutes?: number;

  @ApiProperty({
    description: 'Link to the Figma design for the assessment (if any)',
    example: 'https://www.figma.com/file/xyz123/example-design',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  figmaLink?: string;

  @ApiProperty({
    description: 'Link to the GitHub repository template (if any)',
    example: 'https://github.com/example/repo',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  githubRepoLink?: string;

  @ApiProperty({
    description: 'Any reference documentation links (if any)',
    example: 'https://developer.mozilla.org/en-US/',
    required: false,
  })
  @IsOptional()
  @IsString()
  referenceDocLinks?: string;

  @ApiProperty({
    description: 'Responsibilities the candidate is expected to handle',
    example: 'Build responsive UI, handle state management, follow best practices.',
  })
  @IsString()
  @IsNotEmpty()
  candidateResponsibilities: string;

  @ApiProperty({
    description: 'Type of work environment',
    enum: ['product', 'service', 'both'],
    example: 'product',
  })
  @IsEnum(['product', 'service', 'both'])
  workEnvironment: 'product' | 'service' | 'both';

  @ApiProperty({
    description: 'Detailed structure and expectations of the assessment',
    example: 'Complete a small project using React and Tailwind CSS.',
  })
  @IsString()
  @IsNotEmpty()
  assessmentDetails: string;
  
  @ApiProperty({
    description: 'Start time of the assessment (if applicable)',
    example: '2023-10-01T10:00:00Z',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  startTime?: Date;


  @ApiProperty({
    description: 'Link to the meeting (if applicable)',
    example: 'https://meet.example.com/meeting123',
    required: true,
  })
  meetingLink?: string;

  @IsUUID()
  @IsOptional()
  companyId: string;
}
