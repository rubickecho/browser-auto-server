import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        // synchronize: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}