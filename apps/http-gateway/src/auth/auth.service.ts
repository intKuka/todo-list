import { CreateUserDto, RmqCommands, SignInDto } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserTokenPayload } from './interfaces/user-token-payload.interface';
import { Result } from '@app/common/interfaces/result.interface';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';
import * as bcrypt from 'bcrypt';
import { UserDataResponse } from './interfaces/user-data-response.interface';

const TOKEN_SERVICE = process.env.TOKEN_SERVICE_NAME;
const USER_SERVICE = process.env.USER_SERVICE_NAME;

@Injectable()
export class AuthService {
  constructor(
    @Inject(TOKEN_SERVICE) private tokenClient: ClientRMQ,
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
  ) {}

  async signUp(data: CreateUserDto) {
    const { data: userId } = await firstValueFrom(
      this.userClient.send(RmqCommands.user.create, data),
    );
    return await this.createToken(userId);
  }

  async signIn(data: SignInDto) {
    const result: Result = await firstValueFrom(
      this.userClient.send(RmqCommands.user.findOneByEmail, data.email),
    );
    if (!result.isSuccess) {
      throw new InvalidCredentialsException();
    }

    const userData: UserDataResponse = result.data;
    const isMatch = await bcrypt.compare(data.password, userData.password);
    if (!isMatch) {
      throw new InvalidCredentialsException();
    }
    return await this.createToken({ id: userData.id, email: userData.email });
  }

  private async createToken(payload: UserTokenPayload) {
    return await firstValueFrom(
      this.tokenClient.send(RmqCommands.token.create, payload),
    );
  }
}
