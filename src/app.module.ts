import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
// import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';

import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
            ".env.development.local",
            ".env.production",
            ".env"
        ],
    }),
    // DatabaseModule,
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
