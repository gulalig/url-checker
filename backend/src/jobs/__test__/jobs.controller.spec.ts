import { JobsController } from '../jobs.controller';
import { JobsService } from '../jobs.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CancelJobResponse,
  CreateJobResponse,
  JobDetails,
  JobSummary,
} from '../interfaces/job.interface';
import { JobStatus } from '../enums/job-status.enum';

type JobsServiceMock = {
  createJob: jest.MockedFunction<JobsService['createJob']>;
  getJobs: jest.MockedFunction<JobsService['getJobs']>;
  getJobDetails: jest.MockedFunction<JobsService['getJobDetails']>;
  cancelJob: jest.MockedFunction<JobsService['cancelJob']>;
};

describe('JobsController', () => {
  let controller: JobsController;
  let jobsService: JobsServiceMock;

  beforeEach(async () => {
    jobsService = {
      createJob: jest.fn<
        ReturnType<JobsService['createJob']>,
        Parameters<JobsService['createJob']>
      >(),
      getJobs: jest.fn<
        ReturnType<JobsService['getJobs']>,
        Parameters<JobsService['getJobs']>
      >(),
      getJobDetails: jest.fn<
        ReturnType<JobsService['getJobDetails']>,
        Parameters<JobsService['getJobDetails']>
      >(),
      cancelJob: jest.fn<
        ReturnType<JobsService['cancelJob']>,
        Parameters<JobsService['cancelJob']>
      >(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: jobsService,
        },
      ],
    }).compile();

    controller = module.get(JobsController);
  });

  it('should create a job', async () => {
    const response: CreateJobResponse = {
      jobId: 'job-id',
    };

    jobsService.createJob.mockResolvedValue(response);

    await expect(
      controller.createJob({
        urls: ['https://example.com'],
      }),
    ).resolves.toEqual(response);

    expect(jobsService.createJob).toHaveBeenCalledTimes(1);
    expect(jobsService.createJob).toHaveBeenCalledWith({
      urls: ['https://example.com'],
    });
  });

  it('should return job summaries', () => {
    const response: JobSummary[] = [
      {
        id: 'job-id',
        createdAt: '2026-06-23T10:00:00.000Z',
        status: JobStatus.Pending,
        total: 1,
        processed: 0,
        success: 0,
        error: 0,
        cancelled: 0,
      },
    ];

    jobsService.getJobs.mockReturnValue(response);

    expect(controller.getJobs()).toEqual(response);
    expect(jobsService.getJobs).toHaveBeenCalledTimes(1);
  });

  it('should return job details', () => {
    const response: JobDetails = {
      id: 'job-id',
      createdAt: '2026-06-23T10:00:00.000Z',
      status: JobStatus.Pending,
      urls: [],
      total: 0,
      processed: 0,
      success: 0,
      error: 0,
      cancelled: 0,
    };

    jobsService.getJobDetails.mockReturnValue(response);

    expect(controller.getJobDetails('job-id')).toEqual(response);
    expect(jobsService.getJobDetails).toHaveBeenCalledTimes(1);
    expect(jobsService.getJobDetails).toHaveBeenCalledWith('job-id');
  });

  it('should cancel a job', async () => {
    const response: CancelJobResponse = {
      jobId: 'job-id',
      status: JobStatus.Cancelled,
    };

    jobsService.cancelJob.mockResolvedValue(response);

    await expect(controller.cancelJob('job-id')).resolves.toEqual(response);

    expect(jobsService.cancelJob).toHaveBeenCalledTimes(1);
    expect(jobsService.cancelJob).toHaveBeenCalledWith('job-id');
  });
});
