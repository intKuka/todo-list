import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { stringToSlug } from 'src/common/helpers/work-with-slug.helper';
import { NotAllowedToThisUser } from 'src/common/exceptions/not-allowed-to-this-user.exception';
import { NotAllowedFromAnotherProject } from 'src/common/exceptions/not-allowed-from-another-project.exception';

@Injectable()
export class AllowTaskActions implements CanActivate {
  constructor(private tasks: TasksService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getClass() !== TasksController) return true;

    return this.validateRequest(context);
  }

  private async validateRequest(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { title, id } = request.params;
    const userId = request['user']?.id;
    console.log(userId);
    const projectSlug = stringToSlug(title);

    const task = await this.tasks.findTaskById(Number.parseInt(id));

    // check if the task belongs to specified project
    if (task?.userId !== userId) {
      throw new NotAllowedToThisUser();
    } else if (task?.projectSlug !== projectSlug) {
      throw new NotAllowedFromAnotherProject();
    }
    return true;
  }
}
