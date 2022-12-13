import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { logger } from 'libs/utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (!(exception instanceof HttpException) || exception.getStatus() >= 500) {
      logger.error(exception);
      exception = new InternalServerErrorException('Unknown Error');
      return response.status((exception as HttpException).getStatus()).json((exception as HttpException).getResponse());
    }
    logger.log(exception);
    return response.status(exception.getStatus()).json(exception.getResponse());
  }
}
