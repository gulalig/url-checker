import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from './enums/job-status.enum';
import {
  CancelJobResponse,
  CreateJobResponse,
  JobDetails,
  JobSummary,
} from './interfaces/job.interface';
import {
  mapJobToDetails,
  mapJobToSummary,
} from './mappers/job-response.mapper';
import { JobsRepository } from './repositories/jobs.repository';
import { inngest } from '../inngest/inngest.client';
import { InngestEventName } from '../inngest/enums/inngest-event-name.enum';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  async createJob(dto: CreateJobDto): Promise<CreateJobResponse> {
    const job = this.jobsRepository.create({
      urls: dto.urls,
    });

    await inngest.send(
      job.urls.map((urlCheck) => ({
        name: InngestEventName.UrlCheckRequested,
        data: {
          jobId: job.id,
          urlCheckId: urlCheck.id,
          url: urlCheck.url,
        },
      })),
    );

    return {
      jobId: job.id,
    };
  }

  getJobs(): JobSummary[] {
    return this.jobsRepository.findAll().map(mapJobToSummary);
  }

  getJobDetails(jobId: string): JobDetails {
    const job = this.jobsRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return mapJobToDetails(job);
  }

  async cancelJob(jobId: string): Promise<CancelJobResponse> {
    const job = this.jobsRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status === JobStatus.Completed) {
      throw new ConflictException('Completed job cannot be cancelled');
    }

    if (job.status === JobStatus.Failed) {
      throw new ConflictException('Failed job cannot be cancelled');
    }

    const cancelledJob = this.jobsRepository.cancel(jobId);

    if (!cancelledJob) {
      throw new NotFoundException('Job not found');
    }

    await inngest.send({
      name: InngestEventName.JobCancelled,
      data: {
        jobId: cancelledJob.id,
      },
    });

    return {
      jobId: cancelledJob.id,
      status: JobStatus.Cancelled,
    };
  }

  markUrlInProgress(jobId: string, urlCheckId: string): void {
    this.jobsRepository.markUrlInProgress(jobId, urlCheckId);
  }

  saveUrlSuccess(jobId: string, urlCheckId: string, httpStatus: number): void {
    this.jobsRepository.saveUrlSuccess(jobId, urlCheckId, httpStatus);
  }

  saveUrlError(jobId: string, urlCheckId: string, error: string): void {
    this.jobsRepository.saveUrlError(jobId, urlCheckId, error);
  }

  isJobCancelled(jobId: string): boolean {
    const job = this.jobsRepository.findById(jobId);

    return job?.status === JobStatus.Cancelled;
  }
}
