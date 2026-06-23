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
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ERROR_MESSAGES } from '../common/constants/error-messages.constant';
import { LOGGER_MESSAGES } from '../logger/constants/logger-messages.constant';

@Injectable()
export class JobsService {
  constructor(
    private readonly jobsRepository: JobsRepository,
    @InjectPinoLogger(JobsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async createJob(dto: CreateJobDto): Promise<CreateJobResponse> {
    const job = this.jobsRepository.create({
      urls: dto.urls,
    });

    this.logger.info(
      {
        jobId: job.id,
        totalUrls: job.urls.length,
      },
      LOGGER_MESSAGES.JOB_CREATED,
    );

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

    this.logger.info(
      {
        jobId: job.id,
        totalEvents: job.urls.length,
      },
      LOGGER_MESSAGES.URL_CHECK_EVENTS_SENT_TO_INNGEST,
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
      this.logger.warn({ jobId }, LOGGER_MESSAGES.JOB_DETAILS_NOT_FOUND);

      throw new NotFoundException(ERROR_MESSAGES.JOB_NOT_FOUND);
    }

    return mapJobToDetails(job);
  }

  async cancelJob(jobId: string): Promise<CancelJobResponse> {
    const job = this.jobsRepository.findById(jobId);

    if (!job) {
      this.logger.warn({ jobId }, LOGGER_MESSAGES.JOB_CANCELLATION_NOT_FOUND);

      throw new NotFoundException(ERROR_MESSAGES.JOB_NOT_FOUND);
    }

    if (job.status === JobStatus.Completed) {
      this.logger.warn(
        {
          jobId,
          status: job.status,
        },
        LOGGER_MESSAGES.FAILED_JOB_CANCELLATION_REJECTED,
      );

      throw new ConflictException(
        ERROR_MESSAGES.COMPLETED_JOB_CANNOT_BE_CANCELLED,
      );
    }

    if (job.status === JobStatus.Failed) {
      this.logger.warn(
        {
          jobId,
          status: job.status,
        },
        LOGGER_MESSAGES.FAILED_JOB_CANCELLATION_REJECTED,
      );

      throw new ConflictException(
        ERROR_MESSAGES.FAILED_JOB_CANNOT_BE_CANCELLED,
      );
    }

    const cancelledJob = this.jobsRepository.cancel(jobId);

    if (!cancelledJob) {
      this.logger.warn(
        { jobId },
        LOGGER_MESSAGES.JOB_DISAPPEARED_DURING_CANCELLATION,
      );

      throw new NotFoundException(ERROR_MESSAGES.JOB_NOT_FOUND);
    }

    await inngest.send({
      name: InngestEventName.JobCancelled,
      data: {
        jobId: cancelledJob.id,
      },
    });

    this.logger.info(
      {
        jobId: cancelledJob.id,
      },
      LOGGER_MESSAGES.JOB_CANCELLED_AND_EVENT_SENT,
    );

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

    this.logger.debug(
      {
        jobId,
        urlCheckId,
        httpStatus,
      },
      LOGGER_MESSAGES.URL_CHECK_SAVED_AS_SUCCESS,
    );
  }

  saveUrlError(jobId: string, urlCheckId: string, error: string): void {
    this.jobsRepository.saveUrlError(jobId, urlCheckId, error);

    this.logger.debug(
      {
        jobId,
        urlCheckId,
        error,
      },
      LOGGER_MESSAGES.URL_CHECK_SAVED_AS_ERROR,
    );
  }

  isJobCancelled(jobId: string): boolean {
    const job = this.jobsRepository.findById(jobId);

    return job?.status === JobStatus.Cancelled;
  }
}
