import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
/**
 * 拦截器，用于捕获全局异常并返回统一的错误响应。
 */
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      catchError((err) => {
        response.locals.data = err;
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }

        const { statusCode, message } = err.response;
        return throwError(
          () => {
            return {
              statusCode,
              message: message ? (Array.isArray(message) ? message.join(',') : message) : '服务器错误'
            }
          }
        );
      }),
    );
  }
}
