import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
// import { Token, TokenType } from '../entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Token ,TokenType} from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Token) private readonly tokenRepo: Repository<Token>,
  ) {}

  async generateToken(user: any) {
    // Generate Access Token
    const accessToken = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.secret, expiresIn: '30d' },
    );

    // Generate Refresh Token
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.secret, expiresIn: '90d' }, // Refresh token valid for 7 days
    );

    // Save Refresh Token in Database
    const newToken = this.tokenRepo.create({
      userId: user.id,
      type: TokenType.REFRESH,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
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
