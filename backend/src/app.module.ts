import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { InngestModule } from './inngest/inngest.module';

@Module({
  imports: [JobsModule, InngestModule],
})
export class AppModule {}
