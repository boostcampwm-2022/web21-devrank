import { LoggerMiddleware } from '@libs/common/middlewares/console-logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.DB_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev = process.env.NODE_ENV === 'development';
  configure(consumer: MiddlewareConsumer) {
    if (this.isDev) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
      mongoose.set('debug', true);
    }
  }
}
