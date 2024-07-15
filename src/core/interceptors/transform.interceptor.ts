import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
/**
 * 转换拦截器
 * @template T
 */
export class TransformInterceptor<T>
  implements NestInterceptor<T, T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T> {
    return next.handle().pipe(
      map(
        (data) => {
          // 如果是失败的请求，直接返回
          // @ts-ignore
          if (data && data.status === 'FAIL') {
            return data;
          }

          return {
            status: "SUCCESS",
            data,
            message: '请求成功'
          } as T;
        }
      )
    );
  }
}
