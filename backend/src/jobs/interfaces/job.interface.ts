import { JobStatus } from '../enums/job-status.enum';
import { UrlCheckStatus } from '../enums/url-check-status.enum';

export interface UrlCheck {
  id: string;
  url: string;
  status: UrlCheckStatus;
  httpStatus?: number;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
}

export interface Job {
  id: string;
  createdAt: string;
  status: JobStatus;
  urls: UrlCheck[];
}

export interface JobStats {
  total: number;
  processed: number;
  success: number;
  error: number;
  cancelled: number;
}

export interface JobSummary extends JobStats {
  id: string;
  createdAt: string;
  status: JobStatus;
}

export interface JobDetails extends JobStats {
  id: string;
  createdAt: string;
  status: JobStatus;
  urls: UrlCheck[];
}

export interface CreateJobData {
  urls: string[];
}