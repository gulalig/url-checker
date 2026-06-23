export const INNGEST_FUNCTION = {
  CHECK_URL_ID: 'check-url',
  CHECK_URL_NAME: 'Check URL',
  CHECK_URL_CONCURRENCY_LIMIT: 5,
  CHECK_URL_KEY: 'event.data.jobId',
  CHECK_URL_CANCEL_EXPRESSION: 'async.data.jobId == event.data.jobId',
} as const;

export const INNGEST_STEP = {
  CHECK_JOB_BEFORE_START: 'check-job-before-start',
  MARK_URL_IN_PROGRESS: 'mark-url-in-progress',
  PERFORM_HEAD_REQUEST: 'perform-head-request',
  GENERATE_RANDOM_DELAY: 'generate-random-delay',
  DELAY_BEFORE_SAVING_RESULT: 'delay-before-saving-result',
  CHECK_JOB_BEFORE_SAVE: 'check-job-before-save',
  SAVE_URL_RESULT: 'save-url-result',
} as const;

export const URL_CHECK_CONFIG = {
  HEAD_REQUEST_TIMEOUT_MS: 10_000,
  MAX_RANDOM_DELAY_SECONDS: 10,
} as const;
