import { IsOptional, IsString, IsArray, IsUrl, IsNumber } from 'class-validator';

export class UpdateUserDto {
  
  @IsOptional()
  @IsString()
  fullName?: string;


  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) 
  skills?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
age:number
  @IsOptional()
  @IsUrl()
  githubProfile?: string;
}
