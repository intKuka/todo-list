import { Controller, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, RmqCommands, StatusOnSuccess } from '@app/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @StatusOnSuccess(HttpStatus.CREATED)
  @MessagePattern(RmqCommands.user.create)
  async createUser(data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  @StatusOnSuccess(HttpStatus.OK)
  @MessagePattern(RmqCommands.user.findAll)
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @StatusOnSuccess(HttpStatus.OK)
  @MessagePattern(RmqCommands.user.findOneByEmail)
  async findOneByEmail(email: string) {
    return await this.userService.findOneByEmail(email);
  }

  @StatusOnSuccess(HttpStatus.OK)
  @MessagePattern(RmqCommands.user.delete)
  async deleteUser(id: number) {
    return await this.userService.deleteUser(id);
  }
}
