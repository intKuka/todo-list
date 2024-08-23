import { Controller, HttpStatus, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  RmqCommands,
  RpcShared,
  StatusOnSuccess,
  UnknownAsRpcExceptionFilter,
} from '@app/common';
import { AuthService } from './auth.service';

@RpcShared()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseFilters(UnknownAsRpcExceptionFilter)
  @StatusOnSuccess(HttpStatus.CREATED)
  @MessagePattern(RmqCommands.token.create)
  async createToken(payload: any) {
    return await this.authService.createToken(payload);
  }

  @StatusOnSuccess(HttpStatus.OK)
  @MessagePattern(RmqCommands.token.verify)
  async verifyToken(token: string) {
    return await this.authService.verifyToken(token);
  }
}
