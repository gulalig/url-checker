import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JobStatus } from '../enums/job-status.enum';
import { UrlCheckStatus } from '../enums/url-check-status.enum';
import { CreateJobData, Job, UrlCheck } from '../interfaces/job.interface';

@Injectable()
export class JobsRepository {
  private readonly jobs = new Map<string, Job>();

  create(data: CreateJobData): Job {
    const jobId = randomUUID();

    const urls: UrlCheck[] = data.urls.map((url) => ({
      id: randomUUID(),
      url,
      status: UrlCheckStatus.Pending,
    }));

    const job: Job = {
      id: jobId,
      createdAt: new Date().toISOString(),
      status: JobStatus.Pending,
      urls,
    };

    this.jobs.set(job.id, job);

    return job;
  }

  findAll(): Job[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findById(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  save(job: Job): Job {
    this.jobs.set(job.id, job);

    return job;
  }

  cancel(jobId: string): Job | undefined {
    const job = this.findById(jobId);

    if (!job) {
      return undefined;
    }

    const finishedAt = new Date().toISOString();

    const cancelledJob: Job = {
      ...job,
      status: JobStatus.Cancelled,
      urls: job.urls.map((urlCheck) => {
        if (
          urlCheck.status !== UrlCheckStatus.Pending &&
          urlCheck.status !== UrlCheckStatus.InProgress
        ) {
          return urlCheck;
        }

        return {
          ...urlCheck,
          status: UrlCheckStatus.Cancelled,
          finishedAt,
          durationMs: this.calculateDurationMs(urlCheck.startedAt, finishedAt),
        };
      }),
    };

    this.jobs.set(cancelledJob.id, cancelledJob);

    return cancelledJob;
  }

  markUrlInProgress(jobId: string, urlCheckId: string): UrlCheck | undefined {
    const job = this.findById(jobId);

    if (!job || job.status === JobStatus.Cancelled) {
      return undefined;
    }

    const startedAt = new Date().toISOString();
    let updatedUrlCheck: UrlCheck | undefined;

    const updatedJob: Job = {
      ...job,
      status: JobStatus.InProgress,
      urls: job.urls.map((urlCheck) => {
        if (urlCheck.id !== urlCheckId) {
          return urlCheck;
        }

        updatedUrlCheck = {
          ...urlCheck,
          status: UrlCheckStatus.InProgress,
          startedAt,
        };

        return updatedUrlCheck;
      }),
    };

    this.save(updatedJob);

    return updatedUrlCheck;
  }

  saveUrlSuccess(
    jobId: string,
    urlCheckId: string,
    httpStatus: number,
  ): UrlCheck | undefined {
    const job = this.findById(jobId);

    if (!job || job.status === JobStatus.Cancelled) {
      return undefined;
    }

    const finishedAt = new Date().toISOString();
    let updatedUrlCheck: UrlCheck | undefined;

    const updatedJob: Job = {
      ...job,
      urls: job.urls.map((urlCheck) => {
        if (urlCheck.id !== urlCheckId) {
          return urlCheck;
        }

        updatedUrlCheck = {
          ...urlCheck,
          status: UrlCheckStatus.Success,
          httpStatus,
          finishedAt,
          durationMs: this.calculateDurationMs(urlCheck.startedAt, finishedAt),
        };

        return updatedUrlCheck;
      }),
    };

    this.save(this.recalculateJobStatus(updatedJob));

    return updatedUrlCheck;
  }

  saveUrlError(
    jobId: string,
    urlCheckId: string,
    error: string,
  ): UrlCheck | undefined {
    const job = this.findById(jobId);

    if (!job || job.status === JobStatus.Cancelled) {
      return undefined;
    }

    const finishedAt = new Date().toISOString();
    let updatedUrlCheck: UrlCheck | undefined;

    const updatedJob: Job = {
      ...job,
      urls: job.urls.map((urlCheck) => {
        if (urlCheck.id !== urlCheckId) {
          return urlCheck;
        }

        updatedUrlCheck = {
          ...urlCheck,
          status: UrlCheckStatus.Error,
          error,
          finishedAt,
          durationMs: this.calculateDurationMs(urlCheck.startedAt, finishedAt),
        };

        return updatedUrlCheck;
      }),
    };

    this.save(this.recalculateJobStatus(updatedJob));

    return updatedUrlCheck;
  }

  private recalculateJobStatus(job: Job): Job {
    if (job.status === JobStatus.Cancelled || job.status === JobStatus.Failed) {
      return job;
    }

    const finalStatuses = [
      UrlCheckStatus.Success,
      UrlCheckStatus.Error,
      UrlCheckStatus.Cancelled,
    ];

    const isCompleted = job.urls.every((urlCheck) =>
      finalStatuses.includes(urlCheck.status),
    );

    return {
      ...job,
      status: isCompleted ? JobStatus.Completed : JobStatus.InProgress,
    };
  }

  private calculateDurationMs(
    startedAt: string | undefined,
    finishedAt: string,
  ): number | undefined {
    if (!startedAt) {
      return undefined;
    }

    return new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  }
}
