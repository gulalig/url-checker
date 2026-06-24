import type { JobStatus, UrlCheckStatus } from '@/types';

export const JOB_POLLING_INTERVAL_MS = 2_000;

export const FINAL_JOB_STATUSES: readonly JobStatus[] = [
  'completed',
  'cancelled',
  'failed',
];

export const FINAL_URL_CHECK_STATUSES: readonly UrlCheckStatus[] = [
  'success',
  'error',
  'cancelled',
];

export const CREATE_JOB_FORM_FIELD = {
  URLS: 'urls',
} as const;

export const CREATE_JOB_FORM_LABEL = {
  URLS: 'URLs',
  SUBMIT: 'Start check',
} as const;

export const CREATE_JOB_FORM_PLACEHOLDER = {
  URLS: 'https://example.com\nhttps://github.com',
} as const;

export const CREATE_JOB_FORM_DEFAULT_VALUES = {
  urls: '',
};

export const CREATE_JOB_FORM_VALIDATION_MESSAGE = {
  URLS_REQUIRED: 'Please enter at least one URL.',
  URL_INVALID:
    'Each URL must be valid and include http:// or https://. Put each URL on a new line.',
  URL_DUPLICATE: 'Duplicate URLs are not allowed.',
} as const;