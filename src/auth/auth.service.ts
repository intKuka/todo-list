import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserMetadata } from 'src/common/types';

//TODO: move exception message to constans
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
    if (isExists) {
      throw new ConflictException(`Email ${email} is already taken`);
    }
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
    return { access_token: await this.jwtService.signAsync(payload) };
  }

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
