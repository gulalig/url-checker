import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  createJob(dto: CreateJobDto): CreateJobResponse {
    const job = this.jobsRepository.create({
      urls: dto.urls,
    });

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

  cancelJob(jobId: string): CancelJobResponse {
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

    return {
      jobId: cancelledJob.id,
      status: JobStatus.Cancelled,
    };
  }
}