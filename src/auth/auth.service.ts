import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignedInDto } from './dto/signed-in.dto';
import { EmailAlreadyOccupied } from 'src/common/exceptions/user/email-already-occupied.exception';
import { UserMetadata } from 'src/common/custom-types/common.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup({ email, password }: SignUpDto) {
    const isExists = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isExists) throw new EmailAlreadyOccupied();

    const hash = await bcrypt.hash(password, 7);
    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: hash,
      },
    });
    const payload: UserMetadata = {
      id: user.id,
      email: user.email,
    };
    return new SignedInDto(await this.jwtService.signAsync(payload));
  }

  async signin({ email, password }: SignInDto) {
    const user = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          email: email,
        },
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    const hash = user.password;
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) throw new UnauthorizedException();

    const payload = {
      id: user.id,
      email: user.email,
    };
    return new SignedInDto(await this.jwtService.signAsync(payload));
  }
}
