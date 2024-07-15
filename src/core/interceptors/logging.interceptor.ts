import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse();
    const method = request.method;
    const url = request.url;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Request Method: ${method}, URL: ${url}, Request Body: ${JSON.stringify(
          request.body,
        )}`,
      );
    }
    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Response Method: ${method}, URL: ${url}, Duration: ${
              Date.now() - now
            }ms, Response Body: ${response.body}`,
          );
        }
        response.locals.data = data;
      }),
    );
  }
}
