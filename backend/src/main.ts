import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { inngest } from './inngest/inngest.client';
import { InngestFunctionsService } from './inngest/inngest-functions.service';
import { serve } from 'inngest/express';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
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

  await app.listen(process.env.PORT ?? 3000);
};

void bootstrap();
