import { SignedInDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { throwJwtException } from '../helpers/throw-jwt-exception.helper';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createToken(payload: any) {
    return new SignedInDto(await this.jwtService.signAsync(payload));
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService
      .verifyAsync(token)
      .catch((err) => throwJwtException(err));

    return payload;
  }
}
