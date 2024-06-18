import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { GeteUserDto } from './dto/get-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    // TODO: use transform
    const password = data.password;
    const hash = await bcrypt.hash(password, 7);
    data.password = hash;

    const user = await this.prisma.user.create({
      data: data,
    });

    // TODO: use interceptor
    const dto = new GeteUserDto();
    dto.id = user.id;
    dto.email = user.email;
    return dto;
  }

  async fintAllUsers() {
    return await this.prisma.user.findMany();
  }
}
