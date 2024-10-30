import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RmqCommands } from '@app/common';
import {
  CreateProjectData,
  DeleteProjectById,
  GetProjectById,
  GetProjectsOfUser,
  UpdateProjectData,
} from '@app/todos';
import { UpdateProjectDto } from '@app/todos/models/project/dto/update-project.dto';
import { CreateProjectDto } from '@app/todos/models/project/dto/create-project.dto';

const TODO_SERVICE = process.env.TODO_SERVICE_NAME;

@Injectable()
export class ProjectsService {
  constructor(@Inject(TODO_SERVICE) private readonly todoService: ClientRMQ) {}

  async createProjectForUser(userId: number, data: CreateProjectDto) {
    const payload: CreateProjectData = { userId, project: data };
    return await firstValueFrom(
      this.todoService.send(RmqCommands.todo.project.create, payload),
    );
  }

  async findAllProjectsOfUser(userId: number) {
    const payload: GetProjectsOfUser = { userId };
    return await firstValueFrom(
      this.todoService.send(RmqCommands.todo.project.findAll, payload),
    );
  }

  async findProjectOfUserByTitle(userId: number, projectSlug: string) {
    const payload: GetProjectById = { userId, projectSlug };
    return await firstValueFrom(
      this.todoService.send(RmqCommands.todo.project.findByTitle, payload),
    );
  }

  async updateProjectOfUserByTitle(
    userId: number,
    projectSlug: string,
    data: UpdateProjectDto,
  ) {
    const payload: UpdateProjectData = { userId, projectSlug, update: data };
    return await firstValueFrom(
      this.todoService.send(RmqCommands.todo.project.update, payload),
    );
  }

  async deleteProjectOfUserByTitle(userId: number, projectSlug: string) {
    const payload: DeleteProjectById = { userId, projectSlug };
    return await firstValueFrom(
      this.todoService.send(RmqCommands.todo.project.delete, payload),
    );
  }
}
