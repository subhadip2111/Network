import { PartialType } from '@nestjs/swagger';
import { CreateUsersCollabrateDto } from './create-users-collabrate.dto';
import { IsEnum, IsString } from 'class-validator';
import { STATUS } from '../entities/users-collabrate.entity';

export class UpdateUsersCollabrateDto {
    @IsEnum(STATUS)
    @IsString()
    status: string
}
