import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {
  @ApiProperty({ description: 'group name ' })
  @IsNotEmpty()
  @IsString()
    name:string;

    @IsOptional()
    @IsString()
    members:string[]
    @IsOptional()
    @IsString()
    memberId:string

    @IsOptional() 
    @IsString()
    createdBy:string
}
