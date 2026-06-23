import { UrlCheckStatus } from '../enums/url-check-status.enum';
import {
  Job,
  JobDetails,
  JobStats,
  JobSummary,
} from '../interfaces/job.interface';

const FINAL_URL_STATUSES: UrlCheckStatus[] = [
  UrlCheckStatus.Success,
  UrlCheckStatus.Error,
  UrlCheckStatus.Cancelled,
];

export const getJobStats = (job: Job): JobStats => {
  const success = job.urls.filter(
    (item) => item.status === UrlCheckStatus.Success,
  ).length;

  const error = job.urls.filter(
    (item) => item.status === UrlCheckStatus.Error,
  ).length;

  const cancelled = job.urls.filter(
    (item) => item.status === UrlCheckStatus.Cancelled,
  ).length;

  return {
    total: job.urls.length,
    processed: job.urls.filter((item) =>
      FINAL_URL_STATUSES.includes(item.status),
    ).length,
    success,
    error,
    cancelled,
  };
};

export const mapJobToSummary = (job: Job): JobSummary => ({
  id: job.id,
  createdAt: job.createdAt,
  status: job.status,
  ...getJobStats(job),
});

export const mapJobToDetails = (job: Job): JobDetails => ({
  id: job.id,
  createdAt: job.createdAt,
  status: job.status,
  urls: job.urls,
  ...getJobStats(job),
});
