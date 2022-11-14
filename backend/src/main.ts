import { HttpExceptionFilter } from '@libs/common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.useGlobalFilters(new HttpExceptionFilter());

  // for swagger
  const config = new DocumentBuilder()
    .setTitle('Devrank')
    .setDescription(`Devrank API Docs  - ${configService.get('NODE_ENV')} environment`)
    .setVersion('1.0.0')
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
