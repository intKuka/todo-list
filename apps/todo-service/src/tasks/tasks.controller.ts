import { TasksService } from './tasks.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqCommands } from '@app/common';
import { Controller } from '@nestjs/common';

@Controller()
export class TasksController {
  constructor(private tasks: TasksService) {}

  @MessagePattern(RmqCommands.todo.tasks.create)
  async createTaskInProject(@Payload() payload) {
    const result = await this.tasks.createTaskInProject();
    return result;
  }

  @MessagePattern(RmqCommands.todo.tasks.shift)
  async changeTaskPositionInProject(@Payload() payload) {
    const result = await this.tasks.changeTaskPositionInProject();
    return result;
  }

  @MessagePattern(RmqCommands.todo.tasks.update)
  async updateTaskInProject(@Payload() payload) {
    await this.tasks.updateTaskInProject();
  }

  @MessagePattern(RmqCommands.todo.tasks.delete)
  async deleteTaksInProject(@Payload() payload) {
    await this.tasks.deleteTaksInProject();
  }
}
