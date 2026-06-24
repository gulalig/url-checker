import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { serve } from 'inngest/express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { InngestFunctionsService } from './inngest/inngest-functions.service';
import { inngest } from './inngest/inngest.client';
import { LOGGER_MESSAGES } from './logger/constants/logger-messages.constant';

const getAllowedOrigins = (): string[] => {
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

  return frontendOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    bufferLogs: true,
  });

  const logger = app.get(Logger);

  app.useLogger(logger);

  app.enableCors({
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  app.useBodyParser('json', { limit: '10mb' });

  app.use(
    '/api/inngest',
    serve({
      client: inngest,
      functions: app.get(InngestFunctionsService).getFunctions(),
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  logger.log(LOGGER_MESSAGES.APPLICATION_RUNNING(port), 'Bootstrap');
};

void bootstrap();
