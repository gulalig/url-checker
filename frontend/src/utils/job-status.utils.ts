import { FINAL_JOB_STATUSES, FINAL_URL_CHECK_STATUSES } from '@/constants';
import type { JobStatus, UrlCheckStatus } from '@/types';

export const isFinalJobStatus = (status: JobStatus): boolean =>
  FINAL_JOB_STATUSES.includes(status);

export const isFinalUrlCheckStatus = (status: UrlCheckStatus): boolean =>
  FINAL_URL_CHECK_STATUSES.includes(status);

export const getJobStatusLabel = (status: JobStatus): string =>
  status.replace('_', ' ');