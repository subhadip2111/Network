
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    const apiKey = req.headers['x-api-key'];
 
    const VALID_API_KEY = process.env.SWAGGER_API_KEY ;


    if (apiKey !== VALID_API_KEY) {
      throw new UnauthorizedException('Missing or invalid API key');
    }

    next();
  }
}
