import { SignedInDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { throwJwtException } from '../helpers/throw-jwt-exception.helper';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async createToken(id: number) {
    const options: JwtSignOptions = {
      subject: id.toString(),
    };
    return new SignedInDto(await this.jwtService.signAsync(options));
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService
      .verifyAsync(token)
      .catch((err) => throwJwtException(err));

    return payload;
  }
}
