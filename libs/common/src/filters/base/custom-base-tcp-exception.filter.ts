import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionResult } from '../../classes/http-exception-result.class';
import { Observable } from 'rxjs';
import { ExceptionLogging } from '@app/common';

export abstract class CustomBaseTcpExceptionFilter<TException, TReturns>
  implements ExceptionFilter<TException>, ExceptionLogging
{
  abstract catch(
    exception: TException,
    host: ArgumentsHost,
  ): void | Promise<TReturns> | Observable<TReturns>;

  protected sendResponse(
    result: HttpExceptionResult,
    res: Response,
  ): void | Promise<TReturns> | Observable<TReturns> {
    res.status(result.status).json(result);
  }

  protected abstract createExceptionResult(
    exception: TException,
    req: Request,
  ): HttpExceptionResult;

  writeExceptionToLog(log: any): void {
    console.error(log);
  }
}
