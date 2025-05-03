import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.secret,
    });
  }

  async validate(payload: { userId: string; ownerType: 'user' | 'company' }) {
   console.log(payload);
   
    const { userId, ownerType } = payload;

    let owner;

    if (ownerType === 'user') {
      owner = await this.userService.getUserById(+userId);
    } else if (ownerType === 'company') {
      owner = await this.companyService.findOne(userId);
    }

    if (!owner) {
      throw new UnauthorizedException('Invalid token: owner not found');
    }

    return { ...owner, ownerType }; // Attach both data and type to request.user
  }
}
