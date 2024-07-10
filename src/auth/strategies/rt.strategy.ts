// src/auth/strategies/rt.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload';
import { JwtPayloadWithRt } from './jwt-payload-with-rt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(RtStrategy.name);

  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayloadWithRt> {
    const refreshToken = req.cookies.refreshToken
      .substring('Bearer '.length)
      .trim();

    if (!refreshToken || refreshToken.length === 0) {
      throw new ForbiddenException('Refresh token malformed or missing');
    }

    if (!payload.email) {
      throw new ForbiddenException('Invalid payload, email missing');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
