import { Injectable } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service';
import { InngestEventName } from './enums/inngest-event-name.enum';
import { inngest } from './inngest.client';
import { UrlCheckRequestedEventData } from './interfaces/inngest-event-data.interface';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { INNGEST_FUNCTION, INNGEST_STEP } from './constants/inngest.constants';
import { LOGGER_MESSAGES } from '../logger/constants/logger-messages.constant';
import { SUCCESS_MESSAGES } from '../common/constants/success-messages.constant';
import { ERROR_MESSAGES } from '../common/constants/error-messages.constant';

interface HeadCheckResult {
  ok: boolean;
  httpStatus?: number;
  error?: string;
}

@Injectable()
export class InngestFunctionsService {
  constructor(
    private readonly jobsService: JobsService,
    @InjectPinoLogger(InngestFunctionsService.name)
    private readonly logger: PinoLogger,
  ) {}

  private readonly checkUrlFunction = inngest.createFunction(
    {
      id: INNGEST_FUNCTION.CHECK_URL_ID,
      name: INNGEST_FUNCTION.CHECK_URL_NAME,
      triggers: { event: InngestEventName.UrlCheckRequested },
      concurrency: {
        limit: INNGEST_FUNCTION.CHECK_URL_CONCURRENCY_LIMIT,
        key: INNGEST_FUNCTION.CHECK_URL_KEY,
      },
      cancelOn: [
        {
          event: InngestEventName.JobCancelled,
          if: INNGEST_FUNCTION.CHECK_URL_CANCEL_EXPRESSION,
        },
      ],
    },
    async ({ event, step }) => {
      const data = event.data as UrlCheckRequestedEventData;

      const isCancelledBeforeStart = await step.run(
        INNGEST_STEP.CHECK_JOB_BEFORE_START,
        () => {
          this.logger.info(
            {
              jobId: data.jobId,
              urlCheckId: data.urlCheckId,
              url: data.url,
            },
            LOGGER_MESSAGES.URL_CHECK_FUNCTION_STARTED,
          );

          return this.jobsService.isJobCancelled(data.jobId);
        },
      );

      if (isCancelledBeforeStart) {
        this.logger.warn(
          {
            jobId: data.jobId,
            urlCheckId: data.urlCheckId,
          },
          LOGGER_MESSAGES.URL_CHECK_SKIPPED_JOB_ALREADY_CANCELLED,
        );

        return {
          skipped: true,
          reason: SUCCESS_MESSAGES.JOB_ALREADY_CANCELLED,
        };
      }

      await step.run(INNGEST_STEP.MARK_URL_IN_PROGRESS, () => {
        this.jobsService.markUrlInProgress(data.jobId, data.urlCheckId);
      });

      this.logger.debug(
        {
          jobId: data.jobId,
          urlCheckId: data.urlCheckId,
        },
        LOGGER_MESSAGES.URL_CHECK_MARKED_AS_IN_PROGRESS,
      );

      const result = await step.run(INNGEST_STEP.PERFORM_HEAD_REQUEST, () =>
        this.performHeadRequest(data.url),
      );

      const delaySeconds = await step.run(INNGEST_STEP.GENERATE_RANDOM_DELAY, () =>
        this.getRandomDelaySeconds(),
      );

      this.logger.debug(
        {
          jobId: data.jobId,
          urlCheckId: data.urlCheckId,
          delaySeconds,
        },
        LOGGER_MESSAGES.ARTIFICIAL_DELAY_GENERATED,
      );

      await step.sleep(INNGEST_STEP.DELAY_BEFORE_SAVING_RESULT, `${delaySeconds}s`);

      const isCancelledBeforeSave = await step.run(
        INNGEST_STEP.CHECK_JOB_BEFORE_SAVE,
        () => this.jobsService.isJobCancelled(data.jobId),
      );

      if (isCancelledBeforeSave) {
        this.logger.warn(
          {
            jobId: data.jobId,
            urlCheckId: data.urlCheckId,
          },
          LOGGER_MESSAGES.URL_CHECK_RESULT_SKIPPED_JOB_CANCELLED,
        );

        return {
          skipped: true,
          reason: SUCCESS_MESSAGES.JOB_CANCELLED_BEFORE_SAVING_RESULT,
        };
      }

      await step.run(INNGEST_STEP.SAVE_URL_RESULT, () => {
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
          result.error ?? ERROR_MESSAGES.UNKNOWN_URL_CHECK_ERROR,
        );
      });

      this.logger.info(
        {
          jobId: data.jobId,
          urlCheckId: data.urlCheckId,
          status: result.ok ? 'success' : 'error',
          httpStatus: result.httpStatus,
          error: result.error,
        },
        LOGGER_MESSAGES.URL_CHECK_FUNCTION_COMPLETED,
      );

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

      this.logger.debug(
        {
          url,
          httpStatus: response.status,
        },
        LOGGER_MESSAGES.HEAD_REQUEST_COMPLETED,
      );

      return {
        ok: true,
        httpStatus: response.status,
      };
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);

      this.logger.warn(
        {
          url,
          error: errorMessage,
        },
        LOGGER_MESSAGES.HEAD_REQUEST_FAILED,
      );

      return {
        ok: false,
        error: errorMessage,
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

    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}
