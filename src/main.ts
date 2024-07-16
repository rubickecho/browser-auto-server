import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * 启动应用程序
 * @returns Promise<void>
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // set base path
  app.setGlobalPrefix('v1');

  app.enableCors({
    origin: '*', // 或者指定具体的域名，如 'http://localhost:4200'
  });

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('Browser Auto API')
    .setDescription('The API description')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
