import { Global, Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

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
          ignore: (request) => request.url?.startsWith('/api/inngest') ?? false,
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