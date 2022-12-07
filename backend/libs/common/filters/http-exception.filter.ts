import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { logger } from 'libs/utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException('Unknown Error');
      logger.error(`${exception.stack}`);
    }
    return response.status((exception as HttpException).getStatus()).json((exception as HttpException).getResponse());
  }
}
