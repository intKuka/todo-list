import { Controller, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  RmqCommands,
  RpcShared,
  StatusOnSuccess,
} from '@app/common';

@RpcShared()
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
  @MessagePattern(RmqCommands.user.checkCredentials)
  async checkCredentials(
    @Payload('email') email: string,
    @Payload('password') password: string,
  ) {
    return await this.userService.checkCredentials(email, password);
  }

  @StatusOnSuccess(HttpStatus.OK)
  @MessagePattern(RmqCommands.user.delete)
  async deleteUser(id: number) {
    return await this.userService.deleteUser(id);
  }
}
