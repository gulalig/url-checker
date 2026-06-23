import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { InngestModule } from './inngest/inngest.module';
import { AppLoggerModule } from './logger/app-logger.module';

@Module({
  imports: [AppLoggerModule, JobsModule, InngestModule],
})
export class AppModule {}
