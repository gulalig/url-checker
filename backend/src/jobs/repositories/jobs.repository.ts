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

    const cancelledJob: Job = {
      ...job,
      status: JobStatus.Cancelled,
      urls: job.urls.map((urlCheck) => {
        if (urlCheck.status !== UrlCheckStatus.Pending) {
          return urlCheck;
        }

        return {
          ...urlCheck,
          status: UrlCheckStatus.Cancelled,
          finishedAt: new Date().toISOString(),
        };
      }),
    };

    this.jobs.set(cancelledJob.id, cancelledJob);

    return cancelledJob;
  }
}