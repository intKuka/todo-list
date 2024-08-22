import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RmqCommands, SuccessResult } from '@app/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(RmqCommands.token.create)
  async createUser(id: number) {
    const user = await this.authService.createToken(id);
    return new SuccessResult(HttpStatus.CREATED, user);
  }

  @MessagePattern(RmqCommands.token.verify)
  async verifyToken(token: string) {
    const data = await this.authService.verifyToken(token);
    return new SuccessResult(HttpStatus.OK, data);
  }
}
