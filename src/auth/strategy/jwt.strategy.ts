import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { PrimaryColumnCannotBeNullableError } from 'typeorm';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){


    constructor(
        private readonly userService :UserService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//ignoreExpiration: just to be explicit, we choose the default false setting, 
// which delegates the responsibility of ensuring that a JWT has not expired to the Passport module.
//  This means that if our route is supplied with an expired JWT, the request will be denied and a 401 Unauthorized response sent

            ignoreExpiration: false,
            secretOrKey: process.env.secret
          });
      

    }

    async validate(payload: any) {
        // if we got our jwt-decoded here .after that we can call a db then set payload as the userObject itself.
        console.log("payload",payload)
const user=await this.userService.getUserById(payload.userId)
if(!user){
    return null}
    return user;
         
      }
}