import { PinoLogger } from 'nestjs-pino';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constant';
import { SUCCESS_MESSAGES } from '../../common/constants/success-messages.constant';
import { LOGGER_MESSAGES } from '../../logger/constants/logger-messages.constant';
import { UrlCheckStatus } from '../../jobs/enums/url-check-status.enum';
import { JobsService } from '../../jobs/jobs.service';
import {
  INNGEST_FUNCTION,
  INNGEST_STEP,
  URL_CHECK_CONFIG,
} from '../constants/inngest.constants';
import { InngestEventName } from '../enums/inngest-event-name.enum';
import { inngest } from '../inngest.client';
import { UrlCheckRequestedEventData } from '../interfaces/inngest-event-data.interface';

interface HeadCheckResult {
  ok: boolean;
  httpStatus?: number;
  error?: string;
}

interface CreateCheckUrlFunctionDependencies {
  jobsService: JobsService;
  logger: PinoLogger;
}

type CheckUrlFunction = ReturnType<typeof inngest.createFunction>;

export const createCheckUrlFunction = ({
  jobsService,
  logger,
}: CreateCheckUrlFunctionDependencies): CheckUrlFunction =>
  inngest.createFunction(
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
          logger.info(
            {
              jobId: data.jobId,
              urlCheckId: data.urlCheckId,
              url: data.url,
            },
            LOGGER_MESSAGES.URL_CHECK_FUNCTION_STARTED,
          );

          return jobsService.isJobCancelled(data.jobId);
        },
      );

      if (isCancelledBeforeStart) {
        logger.warn(
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
        jobsService.markUrlInProgress(data.jobId, data.urlCheckId);

        logger.debug(
          {
            jobId: data.jobId,
            urlCheckId: data.urlCheckId,
          },
          LOGGER_MESSAGES.URL_CHECK_MARKED_AS_IN_PROGRESS,
        );
      });

      const result = await step.run(INNGEST_STEP.PERFORM_HEAD_REQUEST, () =>
        performHeadRequest(data.url, logger),
      );

      const delaySeconds = await step.run(
        INNGEST_STEP.GENERATE_RANDOM_DELAY,
        () => {
          const delay = getRandomDelaySeconds();

          logger.debug(
            {
              jobId: data.jobId,
              urlCheckId: data.urlCheckId,
              delaySeconds: delay,
            },
            LOGGER_MESSAGES.ARTIFICIAL_DELAY_GENERATED,
          );

          return delay;
        },
      );

      await step.sleep(
        INNGEST_STEP.DELAY_BEFORE_SAVING_RESULT,
        `${delaySeconds}s`,
      );

      const isCancelledBeforeSave = await step.run(
        INNGEST_STEP.CHECK_JOB_BEFORE_SAVE,
        () => {
          const isCancelled = jobsService.isJobCancelled(data.jobId);

          if (isCancelled) {
            logger.warn(
              {
                jobId: data.jobId,
                urlCheckId: data.urlCheckId,
              },
              LOGGER_MESSAGES.URL_CHECK_RESULT_SKIPPED_JOB_CANCELLED,
            );
          }

          return isCancelled;
        },
      );

      if (isCancelledBeforeSave) {
        return {
          skipped: true,
          reason: SUCCESS_MESSAGES.JOB_CANCELLED_BEFORE_SAVING_RESULT,
        };
      }

      const finalStatus = result.ok
        ? UrlCheckStatus.Success
        : UrlCheckStatus.Error;

      await step.run(INNGEST_STEP.SAVE_URL_RESULT, () => {
        if (result.ok && result.httpStatus !== undefined) {
          jobsService.saveUrlSuccess(
            data.jobId,
            data.urlCheckId,
            result.httpStatus,
          );
        } else {
          jobsService.saveUrlError(
            data.jobId,
            data.urlCheckId,
            result.error ?? ERROR_MESSAGES.UNKNOWN_URL_CHECK_ERROR,
            result.httpStatus,
          );
        }

        logger.info(
          {
            jobId: data.jobId,
            urlCheckId: data.urlCheckId,
            status: finalStatus,
            httpStatus: result.httpStatus,
            error: result.error,
          },
          LOGGER_MESSAGES.URL_CHECK_FUNCTION_COMPLETED,
        );
      });

      return {
        jobId: data.jobId,
        urlCheckId: data.urlCheckId,
        status: finalStatus,
      };
    },
  );

const performHeadRequest = async (
  url: string,
  logger: PinoLogger,
): Promise<HeadCheckResult> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(URL_CHECK_CONFIG.HEAD_REQUEST_TIMEOUT_MS),
    });

    const httpStatus = response.status;

    logger.debug(
      {
        url,
        httpStatus,
      },
      LOGGER_MESSAGES.HEAD_REQUEST_COMPLETED,
    );

    if (!response.ok) {
      logger.warn(
        {
          url,
          httpStatus,
        },
        LOGGER_MESSAGES.HEAD_REQUEST_RETURNED_ERROR_STATUS,
      );

      return {
        ok: false,
        httpStatus,
        error: `HTTP ${httpStatus}`,
      };
    }

    return {
      ok: true,
      httpStatus,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    logger.warn(
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
};

const getRandomDelaySeconds = (): number =>
  Math.floor(Math.random() * (URL_CHECK_CONFIG.MAX_RANDOM_DELAY_SECONDS + 1));

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
};
