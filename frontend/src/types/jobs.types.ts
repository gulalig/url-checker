export type JobStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type UrlCheckStatus =
  | 'pending'
  | 'in_progress'
  | 'success'
  | 'error'
  | 'cancelled';

export type UrlCheck = {
  id: string;
  url: string;
  status: UrlCheckStatus;
  httpStatus?: number;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
};

export type JobStats = {
  total: number;
  processed: number;
  success: number;
  error: number;
  cancelled: number;
};

export type JobSummary = JobStats & {
  id: string;
  createdAt: string;
  status: JobStatus;
};

export type JobDetails = JobStats & {
  id: string;
  createdAt: string;
  status: JobStatus;
  urls: UrlCheck[];
};

export type CreateJobRequest = {
  urls: string[];
};

export type CreateJobResponse = {
  jobId: string;
};

export type CancelJobResponse = {
  jobId: string;
  status: 'cancelled';
};

export type CreateJobFormValues = {
  urls: string;
};

export type UrlCheckStatusFilter = UrlCheckStatus | 'all';