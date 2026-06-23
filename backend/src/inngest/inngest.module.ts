import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { InngestFunctionsService } from './inngest-functions.service';

@Module({
  imports: [JobsModule],
  providers: [InngestFunctionsService],
  exports: [InngestFunctionsService],
})
export class InngestModule {}
