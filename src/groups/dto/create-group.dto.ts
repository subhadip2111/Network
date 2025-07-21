import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGroupDto {
  @ApiProperty({ description: 'group name ' })
  @IsNotEmpty()
  @IsString()
    name:string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    members:string[]
    @IsOptional()
    @IsString()
    memberId:string

    @IsOptional() 
    @IsString()
    createdBy:string

  @IsOptional()
  @IsString()
  image: string;

  
  @IsOptional()
  @IsString()
  description: string;
 
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;
}
