import { HttpStatus } from '@nestjs/common';
import { CustomHttpExceptionResponse } from './http-exception-response.interface';
import { Request, Response } from 'express';
import { ErrorInfo as ErrorInfo } from '../types';
import * as fs from 'fs';

export abstract class CustomBaseExceptionFilter {
  protected createErrorResponse(
    status: HttpStatus,
    errorInfo: ErrorInfo,
    req: Request,
  ): CustomHttpExceptionResponse {
    return {
      ...errorInfo,
      statusCode: status,
      path: req.url,
      method: req.method,
      timestamp: new Date(),
    };
  }

  /**
   * @default path 'errors.log'
   */
  protected writeErrorLogToFile(log: string, path: string = 'errors.log') {
    fs.appendFile(path, log, 'utf8', (err) => {
      if (err) throw err;
    });
  }

  protected sendResponse(message: CustomHttpExceptionResponse, res: Response) {
    res.status(message.statusCode).json(message);
  }
}
