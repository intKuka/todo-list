import { RmqCommands } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

const USER_SERVICE = process.env.USER_SERVICE_NAME;

@Injectable()
export class UserService {
  constructor(@Inject(USER_SERVICE) private userClient: ClientRMQ) {}

  async findAllUsers() {
    return await firstValueFrom(
      this.userClient.send(RmqCommands.user.findAll, {}),
    );
  }

  async deleteUserById(id: number) {
    return await firstValueFrom(
      this.userClient.send(RmqCommands.user.delete, id),
    );
  }
}
