import { CreateUserDto, RmqCommands, SignInDto } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserTokenPayload } from './interfaces/user-token-payload.interface';
import { Result } from '@app/common/interfaces/result.interface';
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
    const result: Result = await firstValueFrom(
      this.userClient.send(RmqCommands.user.create, data),
    );

    return await this.createToken(result.data);
  }

  async signIn(data: SignInDto) {
    const result: Result = await firstValueFrom(
      this.userClient.send(RmqCommands.user.checkCredentials, data),
    );
    return await this.createToken(result.data);
  }

  private async createToken(data: UserDataResponse) {
    const payload: UserTokenPayload = {
      id: data.id,
      email: data.email,
    };
    return await firstValueFrom(
      this.tokenClient.send(RmqCommands.token.create, payload),
    );
  }
}
