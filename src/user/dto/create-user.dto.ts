export class CreateUserDto {
    email:string
}


export class VerifyOtp {
    email:string;
    otp:string;
}



export class LogOutDto{
    refreshToken:string 
}

export class GenerateNewToken{
    accessToken:string
}