import { logger } from '@libs/utils';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'libs/common/filters/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  // for swagger
  const config = new DocumentBuilder()
    .setTitle('Devrank')
    .setDescription(`Devrank API Docs  - ${configService.get('NODE_ENV')} environment`)
    .setVersion('1.0.0')
    .addBearerAuth(
      { in: 'Header', type: 'http', name: 'Authorization', scheme: 'Bearer', bearerFormat: 'Bearer' },
      'accessToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Devrank API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  }); // endpoint : /docs

  // for cors
  app.enableCors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  });

  await app.listen(port || 3000);
}
bootstrap();
