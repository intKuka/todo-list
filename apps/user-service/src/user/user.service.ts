import { Injectable } from '@nestjs/common';
import { CreateUserDto, PrismaService, UserDto } from '@app/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { InvalidCredantialsException } from '../exceptions/invalid-credentials.exception';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    const { password } = data;
    data.password = await bcrypt.hash(password, 7);

    const user = await this.prisma.user.create({
      data: data,
    });

    return new UserDto(user);
  }

  async checkCredentials(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new InvalidCredantialsException();
    }

    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new InvalidCredantialsException();
    }
    return this.prisma.excludeFieldsFromObject(user, [
      'password',
      'updatedAt',
      'createdAt',
    ]);
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findAllUsers() {
    const users: User[] = await this.prisma.user.findMany();
    return this.prisma.excludeFieldsFromList(users, ['password', 'updatedAt']);
  }

  async deleteUser(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
