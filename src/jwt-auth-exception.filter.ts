import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException)
export class JwtAuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (request.xhr || request.headers.accept.indexOf('json') > -1) {
      // API 또는 AJAX 요청의 경우
      response.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
        error: exception.message,
      });
    } else {
      // 브라우저 요청의 경우
      response.redirect('/login');
    }
  }
}
