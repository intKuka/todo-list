import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    const { password } = data;
    const hash = await bcrypt.hash(password, 7);
    data.password = hash;

    const user = await this.prisma.user.create({
      data: data,
    });

    return new UserDto(user);
  }

  async fintAllUsers() {
    return await this.prisma.user
      .findMany()
      .then((users) => users.map((user) => new UserDto(user)));
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
