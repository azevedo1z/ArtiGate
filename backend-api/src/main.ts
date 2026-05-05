import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './app/shared/filters/http-exception.filter';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.use(
    cors({
      origin: configService.get<string>('cors.origin'),
      credentials: true,
      exposedHeaders: ['X-Attachment-Checksum-SHA256', 'Content-Disposition'],
    })
  );

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
  SwaggerModule.setup('', app, document);
  const port = configService.getOrThrow<number>('port');
  const paymentMockEnabled = configService.get<boolean>('payment.mockEnabled');
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
  Logger.log(
    `💳 Payment gateway mock: ${paymentMockEnabled ? 'ENABLED' : 'disabled'}`
  );
}

bootstrap();
