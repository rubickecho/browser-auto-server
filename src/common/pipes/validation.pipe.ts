import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  /**
   * 将输入的值转换为指定类型的对象，并进行验证
   * @param value - 输入的值
   * @param metadata - 参数元数据
   * @returns 转换后的对象
   * @throws BadRequestException 如果验证失败
   */
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    // 如果不是类，或者不需要验证，则直接返回
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    // 如果验证失败，则抛出异常
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }

  /**
   * 判断是否需要验证
   * @param metatype - 参数类型
   * @returns 是否需要验证
   */
  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
