import { Controller } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqCommands, RpcShared } from '@app/common';
import {
  CreateColumnData,
  DeleteColumnById,
  UpdateColumnData,
  UpdateColumnPosition,
} from '@app/todos';

@RpcShared()
@Controller()
export class ColumnsController {
  constructor(private columns: ColumnsService) {}

  @MessagePattern(RmqCommands.todo.columns.create)
  async createColumnInProject(@Payload() payload: CreateColumnData) {
    const result = await this.columns.createColumnInProject(payload);
    return result;
  }

  @MessagePattern(RmqCommands.todo.columns.shift)
  async changeColumnPositionInProject(
    @Payload() payload: UpdateColumnPosition,
  ) {
    const result = await this.columns.changeColumnPositionInProject(payload);
    return result;
  }

  @MessagePattern(RmqCommands.todo.columns.update)
  async updateColumnInProject(@Payload() payload: UpdateColumnData) {
    await this.columns.updateCoumnInProject(payload);
  }

  @MessagePattern(RmqCommands.todo.columns.delete)
  async deleteColumnInProject(@Payload() payload: DeleteColumnById) {
    const result = await this.columns.deleteColumnInProject(payload);
    return result;
  }
}
