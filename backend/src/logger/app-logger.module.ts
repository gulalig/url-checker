import { Global, Module, RequestMethod } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'http';
import { LoggerModule } from 'nestjs-pino';

type PinoRequest = IncomingMessage & {
  id?: string | number;
};

const isProduction = process.env.NODE_ENV === 'production';

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      forRoutes: [
        {
          method: RequestMethod.ALL,
          path: '*path',
        },
      ],
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
        autoLogging: {
          ignore: (request: IncomingMessage) =>
            request.url?.startsWith('/api/inngest') ?? false,
        },
        serializers: {
          req: (request: PinoRequest) => ({
            id: request.id,
            method: request.method,
            url: request.url,
          }),
          res: (response: ServerResponse) => ({
            statusCode: response.statusCode,
          }),
        },
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
              },
            },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
