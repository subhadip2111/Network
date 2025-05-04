import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
// import { Token, TokenType } from '../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Token ,TokenOwnerType,TokenType} from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
  ) {}

  async generateToken(userOrCompany: any, ownerType: TokenOwnerType) {
    const payload = {
      userId: userOrCompany.id,
      ownerType,
    };
  
    // Generate Access Token
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.secret, 
      expiresIn: '30d',
    });
  
    // Generate Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.secret,
      expiresIn: '90d',
    });
  
    // Save Refresh Token in Database
    const newToken = this.tokenRepo.create({
      ownerId: userOrCompany.id,
      ownerType, // <--- this line is added
      type: TokenType.REFRESH,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days expiry
    });
  
    await this.tokenRepo.save(newToken);
  
    return {
      accessToken,
      refreshToken,
    };
  }

async logOut(token:string){
  const tokenEntity = await this.tokenRepo.findOneOrFail({where:{token:token}})
  return tokenEntity

}

}
