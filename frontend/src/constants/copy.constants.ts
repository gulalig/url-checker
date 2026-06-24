export const APP_COPY = {
  TITLE: 'URL Checker',
  DESCRIPTION:
    'Create asynchronous URL checking jobs, track their progress and inspect per-URL results.',
} as const;

export const JOBS_LIST_COPY = {
  TITLE: 'Jobs',
  LOADING: 'Loading jobs...',
  EMPTY: 'No jobs yet. Create your first URL check job.',
} as const;

export const JOB_DETAILS_COPY = {
  TITLE: 'Job details',
  EMPTY: 'Select a job from the list to inspect its details.',
  NOT_LOADED: 'Job details are not loaded yet.',
  LOADING: 'Loading job details...',
  ID_PREFIX: 'Job #',
} as const;

export const FALLBACK_TEXT = {
  EMPTY_VALUE: '-',
} as const;

export const ERROR_MESSAGE = {
  CREATE_JOB_FAILED: 'Failed to create job. Please try again.',
  LOAD_JOBS_FAILED: 'Failed to load jobs',
  LOAD_JOB_DETAILS_FAILED: 'Failed to load job details',
  CANCEL_JOB_FAILED: 'Failed to cancel job',
  UNKNOWN: 'Something went wrong',
} as const;