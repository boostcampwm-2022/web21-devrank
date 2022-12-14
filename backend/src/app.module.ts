import { RedisModule } from '@liaoliaots/nestjs-redis';
import { LoggerMiddleware } from '@libs/common/middlewares/logger.middleware';
import { HttpException, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { AuthModule } from './auth/auth.module';
import { BatchModule } from './batch/batch.module';
import { RankingModule } from './ranking/ranking.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    RavenModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
      }),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    AuthModule,
    UserModule,
    RankingModule,
    BatchModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_INTERCEPTOR, // 전역 인터셉터로 지정
      useValue: new RavenInterceptor({
        filters: [
          {
            type: HttpException,
            // Filter exceptions of type HttpException.
            // Ignore those that have status code of less than 500
            filter: (exception: HttpException) => {
              return 500 > exception.getStatus();
            },
          },
        ],
      }),
    },
  ],
})
export class AppModule implements NestModule {
  private readonly isDev = process.env.NODE_ENV === 'development';
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    if (this.isDev) {
      mongoose.set('debug', true);
    }
  }
}
