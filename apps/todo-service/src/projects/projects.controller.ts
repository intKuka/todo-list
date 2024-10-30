import { Controller } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RmqCommands, RpcShared } from '@app/common';
import {
  CreateProjectData,
  DeleteProjectById,
  GetProjectById,
  GetProjectsOfUser,
  UpdateProjectData,
} from '@app/todos';

@RpcShared()
@Controller()
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @MessagePattern(RmqCommands.todo.project.create)
  async createProject(@Payload() payload: CreateProjectData) {
    return await this.projects.createProject(payload);
  }

  @MessagePattern(RmqCommands.todo.project.findAll)
  async findAllProjects(@Payload() payload: GetProjectsOfUser) {
    return await this.projects.findAllProjectsByUserId(payload);
  }

  @MessagePattern(RmqCommands.todo.project.findByTitle)
  async findUserProjectByTitle(@Payload() payload: GetProjectById) {
    return await this.projects.findProjectByTitleAndUserId(payload);
  }

  @MessagePattern(RmqCommands.todo.project.update)
  async updateUserProjectByTitle(@Payload() payload: UpdateProjectData) {
    await this.projects.updateProjectByTitleAndUserId(payload);
  }

  @MessagePattern(RmqCommands.todo.project.delete)
  async deleteUserProjectByTitle(@Payload() payload: DeleteProjectById) {
    await this.projects.deleteProjectOfUserByTitle(payload);
  }
}
