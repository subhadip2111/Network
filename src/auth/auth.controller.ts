import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateUserDto, VerifyOtp } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ApiSuccessResponse } from 'src/utils/ApiSuccesResponse';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService:UserService,


        private readonly emailService:EmailService,
        private readonly tokenService:TokensService
    ){}

    @Post('login')
    async registerUser(@Body() dto:CreateUserDto){
        console.log(dto)
        const user=await this.userService.create(dto)
        // now make the email sent function to send email  with otp 
await this.emailService.sendWelcomeEmail(user.email,user.otp)
return new ApiSuccessResponse(HttpStatus.OK,true,"register SuccessFully",user)

    }

@HttpCode(200)
    @Post('verify')
    async verifyOtp(@Body()dto:VerifyOtp){
        const user=await this.userService.findUserByEmail(dto.email);
        if(!user){
            throw new HttpException('user not found',HttpStatus.NOT_FOUND)
        }
        if(user.otp!=dto.otp){
            throw new HttpException('invalid otp',HttpStatus.BAD_REQUEST)
        }
        const {accessToken,refreshToken}=await this.tokenService.generateToken(user)
        return new ApiSuccessResponse(HttpStatus.OK, true,'otp verified SuccessFully',{...user,accessToken,refreshToken})

    }
}
