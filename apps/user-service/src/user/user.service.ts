import { Injectable } from '@nestjs/common';
import { CreateUserDto, PrismaService, UserDto } from '@app/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findAllUsers() {
    const users: User[] = await this.prisma.user.findMany();
    return this.prisma.excludeFieldsFromList(users, ['password', 'updatedAt']);
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
