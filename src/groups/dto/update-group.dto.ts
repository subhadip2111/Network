import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import { IsArray, IsOptional, IsString, isString } from 'class-validator';

export class UpdateGroupDto  {
    @IsOptional()
    @IsString()
    name:string

    @IsOptional()
    members:string[]
}
export class MembersDto{
    @IsOptional()
    @IsArray()
    members:string[]
}