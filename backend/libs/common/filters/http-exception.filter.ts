import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { logger } from 'libs/utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (!(exception instanceof HttpException)) {
      logger.error(`${request.url} ${exception.name} ${exception.message}`);
      // TODO: slack에 에러 로그 전달
      // errorHook(exception.name, exception.message);
      exception = new InternalServerErrorException('Unknown Error');
    }

    return response.status((exception as HttpException).getStatus()).json((exception as HttpException).getResponse());
  }
}
