import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JobStatus } from '../enums/job-status.enum';
import { UrlCheckStatus } from '../enums/url-check-status.enum';
import { CreateJobData, Job, UrlCheck } from '../interfaces/job.interface';

@Injectable()
export class JobsRepository {
  private readonly jobs = new Map<string, Job>();

  private isTerminalJobStatus(status: JobStatus): boolean {
    return [
      JobStatus.Completed,
      JobStatus.Cancelled,
      JobStatus.Failed,
    ].includes(status);
  }

  private isFinalUrlCheckStatus(status: UrlCheckStatus): boolean {
    return [
      UrlCheckStatus.Success,
      UrlCheckStatus.Error,
      UrlCheckStatus.Cancelled,
    ].includes(status);
  }

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

    if (!job || this.isTerminalJobStatus(job.status)) {
      return undefined;
    }

    const startedAt = new Date().toISOString();
    let updatedUrlCheck: UrlCheck | undefined;

    const updatedUrls = job.urls.map((urlCheck) => {
      if (urlCheck.id !== urlCheckId) {
        return urlCheck;
      }

      if (this.isFinalUrlCheckStatus(urlCheck.status)) {
        return urlCheck;
      }

      if (urlCheck.status === UrlCheckStatus.InProgress) {
        updatedUrlCheck = urlCheck;

        return urlCheck;
      }

      updatedUrlCheck = {
        ...urlCheck,
        status: UrlCheckStatus.InProgress,
        startedAt,
      };

      return updatedUrlCheck;
    });

    if (!updatedUrlCheck) {
      return undefined;
    }

    this.save({
      ...job,
      status: JobStatus.InProgress,
      urls: updatedUrls,
    });

    return updatedUrlCheck;
  }

  saveUrlSuccess(
    jobId: string,
    urlCheckId: string,
    httpStatus: number,
  ): UrlCheck | undefined {
    const job = this.findById(jobId);

    if (!job || this.isTerminalJobStatus(job.status)) {
      return undefined;
    }

    const finishedAt = new Date().toISOString();
    let updatedUrlCheck: UrlCheck | undefined;

    const updatedUrls = job.urls.map((urlCheck) => {
      if (urlCheck.id !== urlCheckId) {
        return urlCheck;
      }

      if (this.isFinalUrlCheckStatus(urlCheck.status)) {
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
    });

    if (!updatedUrlCheck) {
      return undefined;
    }

    const updatedJob: Job = {
      ...job,
      urls: updatedUrls,
    };

    this.save(this.recalculateJobStatus(updatedJob));

    return updatedUrlCheck;
  }

  saveUrlError(
    jobId: string,
    urlCheckId: string,
    error: string,
    httpStatus?: number,
  ): UrlCheck | undefined {
    const job = this.findById(jobId);

    if (!job || this.isTerminalJobStatus(job.status)) {
      return undefined;
    }

    const finishedAt = new Date().toISOString();
    let updatedUrlCheck: UrlCheck | undefined;

    const updatedUrls = job.urls.map((urlCheck) => {
      if (urlCheck.id !== urlCheckId) {
        return urlCheck;
      }

      if (this.isFinalUrlCheckStatus(urlCheck.status)) {
        return urlCheck;
      }

      updatedUrlCheck = {
        ...urlCheck,
        status: UrlCheckStatus.Error,
        httpStatus,
        error,
        finishedAt,
        durationMs: this.calculateDurationMs(urlCheck.startedAt, finishedAt),
      };

      return updatedUrlCheck;
    });

    if (!updatedUrlCheck) {
      return undefined;
    }

    const updatedJob: Job = {
      ...job,
      urls: updatedUrls,
    };

    this.save(this.recalculateJobStatus(updatedJob));

    return updatedUrlCheck;
  }

  fail(jobId: string, error: string): Job | undefined {
    const job = this.findById(jobId);

    if (!job || this.isTerminalJobStatus(job.status)) {
      return undefined;
    }

    const finishedAt = new Date().toISOString();

    const failedJob: Job = {
      ...job,
      status: JobStatus.Failed,
      urls: job.urls.map((urlCheck) => {
        if (this.isFinalUrlCheckStatus(urlCheck.status)) {
          return urlCheck;
        }

        return {
          ...urlCheck,
          status: UrlCheckStatus.Error,
          error,
          finishedAt,
          durationMs: this.calculateDurationMs(urlCheck.startedAt, finishedAt),
        };
      }),
    };

    this.jobs.set(failedJob.id, failedJob);

    return failedJob;
  }

  private recalculateJobStatus(job: Job): Job {
    if (job.status === JobStatus.Cancelled || job.status === JobStatus.Failed) {
      return job;
    }

    const isCompleted = job.urls.every((urlCheck) =>
      this.isFinalUrlCheckStatus(urlCheck.status),
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
