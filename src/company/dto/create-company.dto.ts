import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class companyRegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}


export class companyLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}

export class RegisterDto {
    @ApiProperty({
        example: 'abc@org.in',
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @ApiProperty({
        example: 'password',
        required: true,
    })
    @IsNotEmpty()
    password: string;
}


export class LoginDto {
    @ApiProperty({
        example: 'abc@org.in',
        required: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @ApiProperty({
        example: 'password',
        required: true,
    })
    @IsNotEmpty()
    password: string;
}