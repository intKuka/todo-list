import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // TODO: validate params
  async signin({ email, password }: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hash = user.password;
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      throw new UnauthorizedException('User is unauthorized');
    }
    const payload = {
      id: user.id,
      email: user.email,
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
