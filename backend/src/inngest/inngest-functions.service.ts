import { Injectable } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service';
import { InngestEventName } from './enums/inngest-event-name.enum';
import { inngest } from './inngest.client';
import { UrlCheckRequestedEventData } from './interfaces/inngest-event-data.interface';

interface HeadCheckResult {
  ok: boolean;
  httpStatus?: number;
  error?: string;
}

@Injectable()
export class InngestFunctionsService {
  constructor(private readonly jobsService: JobsService) {}

  private readonly checkUrlFunction = inngest.createFunction(
    {
      id: 'check-url',
      name: 'Check URL',
      triggers: { event: InngestEventName.UrlCheckRequested },
      concurrency: {
        limit: 5,
        key: 'event.data.jobId',
      },
      cancelOn: [
        {
          event: InngestEventName.JobCancelled,
          if: 'async.data.jobId == event.data.jobId',
        },
      ],
    },
    async ({ event, step }) => {
      const data = event.data as UrlCheckRequestedEventData;

      const isCancelledBeforeStart = await step.run(
        'check-job-before-start',
        () => this.jobsService.isJobCancelled(data.jobId),
      );

      if (isCancelledBeforeStart) {
        return {
          skipped: true,
          reason: 'Job already cancelled',
        };
      }

      await step.run('mark-url-in-progress', () => {
        this.jobsService.markUrlInProgress(data.jobId, data.urlCheckId);
      });

      const result = await step.run('perform-head-request', () =>
        this.performHeadRequest(data.url),
      );

      const delaySeconds = await step.run('generate-random-delay', () =>
        this.getRandomDelaySeconds(),
      );

      await step.sleep('delay-before-saving-result', `${delaySeconds}s`);

      const isCancelledBeforeSave = await step.run(
        'check-job-before-save',
        () => this.jobsService.isJobCancelled(data.jobId),
      );

      if (isCancelledBeforeSave) {
        return {
          skipped: true,
          reason: 'Job cancelled before saving result',
        };
      }

      await step.run('save-url-result', () => {
        if (result.ok && result.httpStatus !== undefined) {
          this.jobsService.saveUrlSuccess(
            data.jobId,
            data.urlCheckId,
            result.httpStatus,
          );

          return;
        }

        this.jobsService.saveUrlError(
          data.jobId,
          data.urlCheckId,
          result.error ?? 'Unknown URL check error',
        );
      });

      return {
        jobId: data.jobId,
        urlCheckId: data.urlCheckId,
        status: result.ok ? 'success' : 'error',
      };
    },
  );

  getFunctions() {
    return [this.checkUrlFunction];
  }

  private async performHeadRequest(url: string): Promise<HeadCheckResult> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10_000),
      });

      return {
        ok: true,
        httpStatus: response.status,
      };
    } catch (error) {
      return {
        ok: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  private getRandomDelaySeconds(): number {
    return Math.floor(Math.random() * 11);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error';
  }
}
