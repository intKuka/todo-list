import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class AllowTaskActions implements CanActivate {
  constructor(private tasks: TasksService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //   if (context.getClass() !== TasksController) return true;

    //   return this.validateRequest(context);
    // }

    // private async validateRequest(ctx: ExecutionContext): Promise<boolean> {
    //   const request = ctx.switchToHttp().getRequest<Request>();
    //   const { title, id } = request.params;
    //   const userId = request['user']?.id;
    //   console.log(userId);
    //   const projectSlug = stringToSlug(title);

    //   const task = await this.tasks.findTaskById(Number.parseInt(id));

    //   // check if the task belongs to specified project
    //   if (task?.userId !== userId) {
    //     throw new NotAllowedToThisUser();
    //   } else if (task?.projectSlug !== projectSlug) {
    //     throw new NotAllowedFromAnotherProject();
    //   }
    return true;
  }
}
