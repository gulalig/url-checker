import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constant';
import { InngestEventName } from '../../inngest/enums/inngest-event-name.enum';
import { inngest } from '../../inngest/inngest.client';
import { JobStatus } from '../enums/job-status.enum';
import { UrlCheckStatus } from '../enums/url-check-status.enum';
import { CreateJobData, Job, UrlCheck } from '../interfaces/job.interface';
import { JobsService } from '../jobs.service';
import { JobsRepository } from '../repositories/jobs.repository';

type JobsRepositoryMock = {
  create: jest.Mock<Job, [CreateJobData]>;
  findAll: jest.Mock<Job[], []>;
  findById: jest.Mock<Job | undefined, [string]>;
  cancel: jest.Mock<Job | undefined, [string]>;
  markUrlInProgress: jest.Mock<UrlCheck | undefined, [string, string]>;
  saveUrlSuccess: jest.Mock<UrlCheck | undefined, [string, string, number]>;
  saveUrlError: jest.Mock<UrlCheck | undefined, [string, string, string]>;
};

type LoggerMock = {
  info: jest.Mock<void, [unknown?, string?]>;
  warn: jest.Mock<void, [unknown?, string?]>;
  debug: jest.Mock<void, [unknown?, string?]>;
};

type InngestSendOutput = {
  ids: string[];
};

const createRepositoryMock = (): JobsRepositoryMock => ({
  create: jest.fn<Job, [CreateJobData]>(),
  findAll: jest.fn<Job[], []>(),
  findById: jest.fn<Job | undefined, [string]>(),
  cancel: jest.fn<Job | undefined, [string]>(),
  markUrlInProgress: jest.fn<UrlCheck | undefined, [string, string]>(),
  saveUrlSuccess: jest.fn<UrlCheck | undefined, [string, string, number]>(),
  saveUrlError: jest.fn<UrlCheck | undefined, [string, string, string]>(),
});

const createLoggerMock = (): LoggerMock => ({
  info: jest.fn<void, [unknown?, string?]>(),
  warn: jest.fn<void, [unknown?, string?]>(),
  debug: jest.fn<void, [unknown?, string?]>(),
});

const createInngestSendOutput = (): InngestSendOutput => ({
  ids: [],
});

const createInngestSendSpy = () => jest.spyOn(inngest, 'send');

describe('JobsService', () => {
  let service: JobsService;
  let repository: JobsRepositoryMock;
  let logger: LoggerMock;
  let inngestSendSpy: ReturnType<typeof createInngestSendSpy>;

  const job: Job = {
    id: 'job-id',
    createdAt: '2026-06-23T10:00:00.000Z',
    status: JobStatus.Pending,
    urls: [
      {
        id: 'url-check-1',
        url: 'https://example.com',
        status: UrlCheckStatus.Pending,
      },
      {
        id: 'url-check-2',
        url: 'https://github.com',
        status: UrlCheckStatus.Pending,
      },
    ],
  };

  beforeEach(async () => {
    repository = createRepositoryMock();
    logger = createLoggerMock();

    inngestSendSpy = createInngestSendSpy();
    inngestSendSpy.mockResolvedValue(createInngestSendOutput());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: JobsRepository,
          useValue: repository,
        },
        {
          provide: getLoggerToken(JobsService.name),
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get(JobsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should create a job and send one Inngest event per URL', async () => {
    repository.create.mockReturnValue(job);

    await expect(
      service.createJob({
        urls: ['https://example.com', 'https://github.com'],
      }),
    ).resolves.toEqual({
      jobId: job.id,
    });

    expect(repository.create.mock.calls).toEqual([
      [
        {
          urls: ['https://example.com', 'https://github.com'],
        },
      ],
    ]);

    expect(inngestSendSpy.mock.calls).toEqual([
      [
        [
          {
            name: InngestEventName.UrlCheckRequested,
            data: {
              jobId: job.id,
              urlCheckId: 'url-check-1',
              url: 'https://example.com',
            },
          },
          {
            name: InngestEventName.UrlCheckRequested,
            data: {
              jobId: job.id,
              urlCheckId: 'url-check-2',
              url: 'https://github.com',
            },
          },
        ],
      ],
    ]);

    expect(logger.info.mock.calls).toHaveLength(2);
  });

  it('should return job summaries', () => {
    repository.findAll.mockReturnValue([job]);

    expect(service.getJobs()).toEqual([
      {
        id: job.id,
        createdAt: job.createdAt,
        status: job.status,
        total: 2,
        processed: 0,
        success: 0,
        error: 0,
        cancelled: 0,
      },
    ]);

    expect(repository.findAll.mock.calls).toHaveLength(1);
  });

  it('should return job details', () => {
    repository.findById.mockReturnValue(job);

    expect(service.getJobDetails(job.id)).toEqual({
      id: job.id,
      createdAt: job.createdAt,
      status: job.status,
      urls: job.urls,
      total: 2,
      processed: 0,
      success: 0,
      error: 0,
      cancelled: 0,
    });

    expect(repository.findById.mock.calls).toEqual([[job.id]]);
  });

  it('should throw NotFoundException when job details are requested for missing job', () => {
    repository.findById.mockReturnValue(undefined);

    expect(() => service.getJobDetails('missing-id')).toThrow(
      new NotFoundException(ERROR_MESSAGES.JOB_NOT_FOUND),
    );

    expect(repository.findById.mock.calls).toEqual([['missing-id']]);
    expect(logger.warn.mock.calls).toHaveLength(1);
  });

  it('should cancel a job and send cancellation event', async () => {
    const cancelledJob: Job = {
      ...job,
      status: JobStatus.Cancelled,
      urls: job.urls.map((urlCheck) => ({
        ...urlCheck,
        status: UrlCheckStatus.Cancelled,
      })),
    };

    repository.findById.mockReturnValue(job);
    repository.cancel.mockReturnValue(cancelledJob);

    await expect(service.cancelJob(job.id)).resolves.toEqual({
      jobId: job.id,
      status: JobStatus.Cancelled,
    });

    expect(repository.findById.mock.calls).toEqual([[job.id]]);
    expect(repository.cancel.mock.calls).toEqual([[job.id]]);

    expect(inngestSendSpy.mock.calls).toEqual([
      [
        {
          name: InngestEventName.JobCancelled,
          data: {
            jobId: job.id,
          },
        },
      ],
    ]);

    expect(logger.info.mock.calls).toHaveLength(1);
  });

  it('should throw NotFoundException when cancelling missing job', async () => {
    repository.findById.mockReturnValue(undefined);

    await expect(service.cancelJob('missing-id')).rejects.toThrow(
      new NotFoundException(ERROR_MESSAGES.JOB_NOT_FOUND),
    );

    expect(repository.findById.mock.calls).toEqual([['missing-id']]);
    expect(repository.cancel.mock.calls).toHaveLength(0);
    expect(inngestSendSpy.mock.calls).toHaveLength(0);
    expect(logger.warn.mock.calls).toHaveLength(1);
  });

  it('should reject cancelling completed job', async () => {
    repository.findById.mockReturnValue({
      ...job,
      status: JobStatus.Completed,
    });

    await expect(service.cancelJob(job.id)).rejects.toThrow(
      new ConflictException(ERROR_MESSAGES.COMPLETED_JOB_CANNOT_BE_CANCELLED),
    );

    expect(repository.cancel.mock.calls).toHaveLength(0);
    expect(inngestSendSpy.mock.calls).toHaveLength(0);
    expect(logger.warn.mock.calls).toHaveLength(1);
  });

  it('should reject cancelling failed job', async () => {
    repository.findById.mockReturnValue({
      ...job,
      status: JobStatus.Failed,
    });

    await expect(service.cancelJob(job.id)).rejects.toThrow(
      new ConflictException(ERROR_MESSAGES.FAILED_JOB_CANNOT_BE_CANCELLED),
    );

    expect(repository.cancel.mock.calls).toHaveLength(0);
    expect(inngestSendSpy.mock.calls).toHaveLength(0);
    expect(logger.warn.mock.calls).toHaveLength(1);
  });

  it('should throw NotFoundException if job disappears during cancellation', async () => {
    repository.findById.mockReturnValue(job);
    repository.cancel.mockReturnValue(undefined);

    await expect(service.cancelJob(job.id)).rejects.toThrow(
      new NotFoundException(ERROR_MESSAGES.JOB_NOT_FOUND),
    );

    expect(repository.cancel.mock.calls).toEqual([[job.id]]);
    expect(inngestSendSpy.mock.calls).toHaveLength(0);
    expect(logger.warn.mock.calls).toHaveLength(1);
  });

  it('should delegate URL progress and result updates to repository', () => {
    const inProgressUrlCheck: UrlCheck = {
      id: 'url-check-1',
      url: 'https://example.com',
      status: UrlCheckStatus.InProgress,
      startedAt: '2026-06-23T10:00:00.000Z',
    };

    const successUrlCheck: UrlCheck = {
      id: 'url-check-1',
      url: 'https://example.com',
      status: UrlCheckStatus.Success,
      httpStatus: 200,
    };

    const errorUrlCheck: UrlCheck = {
      id: 'url-check-2',
      url: 'https://invalid.example',
      status: UrlCheckStatus.Error,
      error: 'fetch failed',
    };

    repository.markUrlInProgress.mockReturnValue(inProgressUrlCheck);
    repository.saveUrlSuccess.mockReturnValue(successUrlCheck);
    repository.saveUrlError.mockReturnValue(errorUrlCheck);

    service.markUrlInProgress(job.id, 'url-check-1');
    service.saveUrlSuccess(job.id, 'url-check-1', 200);
    service.saveUrlError(job.id, 'url-check-2', 'fetch failed');

    expect(repository.markUrlInProgress.mock.calls).toEqual([
      [job.id, 'url-check-1'],
    ]);

    expect(repository.saveUrlSuccess.mock.calls).toEqual([
      [job.id, 'url-check-1', 200],
    ]);

    expect(repository.saveUrlError.mock.calls).toEqual([
      [job.id, 'url-check-2', 'fetch failed'],
    ]);

    expect(logger.debug.mock.calls).toHaveLength(2);
  });

  it('should return true when job is cancelled', () => {
    repository.findById.mockReturnValue({
      ...job,
      status: JobStatus.Cancelled,
    });

    expect(service.isJobCancelled(job.id)).toBe(true);
    expect(repository.findById.mock.calls).toEqual([[job.id]]);
  });

  it('should return false when job is not cancelled', () => {
    repository.findById.mockReturnValue(job);

    expect(service.isJobCancelled(job.id)).toBe(false);
    expect(repository.findById.mock.calls).toEqual([[job.id]]);
  });

  it('should return false when job does not exist', () => {
    repository.findById.mockReturnValue(undefined);

    expect(service.isJobCancelled('missing-id')).toBe(false);
    expect(repository.findById.mock.calls).toEqual([['missing-id']]);
  });
});
