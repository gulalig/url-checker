export const LOGGER_MESSAGES = {
  APPLICATION_RUNNING: (port: string | number): string => `Application is running on http://localhost:${port}`,

  JOB_CREATED: 'Job created',
  JOB_DETAILS_NOT_FOUND: 'Job details requested but job was not found',
  JOB_CANCELLATION_NOT_FOUND: 'Job cancellation requested but job was not found',
  JOB_DISAPPEARED_DURING_CANCELLATION: 'Job disappeared during cancellation',
  JOB_CANCELLED_AND_EVENT_SENT: 'Job cancelled and cancellation event sent to Inngest',

  COMPLETED_JOB_CANCELLATION_REJECTED: 'Completed job cancellation rejected',
  FAILED_JOB_CANCELLATION_REJECTED: 'Failed job cancellation rejected',

  URL_CHECK_EVENTS_SENT_TO_INNGEST: 'URL check events sent to Inngest',
  URL_CHECK_SAVED_AS_SUCCESS: 'URL check saved as success',
  URL_CHECK_SAVED_AS_ERROR: 'URL check saved as error',
  URL_CHECK_FUNCTION_STARTED: 'URL check function started',
  URL_CHECK_SKIPPED_JOB_ALREADY_CANCELLED: 'URL check skipped because job was already cancelled',
  URL_CHECK_MARKED_AS_IN_PROGRESS: 'URL check marked as in progress',
  URL_CHECK_RESULT_SKIPPED_JOB_CANCELLED: 'URL check result skipped because job was cancelled before save',
  URL_CHECK_FUNCTION_COMPLETED: 'URL check function completed',

  ARTIFICIAL_DELAY_GENERATED: 'Artificial delay generated before saving URL result',

  HEAD_REQUEST_COMPLETED: 'HEAD request completed',
  HEAD_REQUEST_FAILED: 'HEAD request failed',
} as const;