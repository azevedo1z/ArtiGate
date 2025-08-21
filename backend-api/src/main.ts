import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import SecurityConfig from './app/shared/config/security.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet(SecurityConfig.helmet));
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe(SecurityConfig.validation));
  app.enableCors(SecurityConfig.cors);

  const config = new DocumentBuilder()
    .setTitle('ArtiGate API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
