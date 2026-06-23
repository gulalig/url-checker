import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JobsService } from '../jobs/jobs.service';
import { createCheckUrlFunction } from './functions/check-url.function';

@Injectable()
export class InngestFunctionsService {
  private readonly functions: ReturnType<typeof createCheckUrlFunction>[];

  constructor(
    private readonly jobsService: JobsService,
    @InjectPinoLogger(InngestFunctionsService.name)
    private readonly logger: PinoLogger,
  ) {
    this.functions = [
      createCheckUrlFunction({
        jobsService: this.jobsService,
        logger: this.logger,
      }),
    ];
  }

  getFunctions(): ReturnType<typeof createCheckUrlFunction>[] {
    return this.functions;
  }
}
