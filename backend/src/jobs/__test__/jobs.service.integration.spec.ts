import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constant';
import { InngestEventName } from '../../inngest/enums/inngest-event-name.enum';
import { inngest } from '../../inngest/inngest.client';
import { JobStatus } from '../enums/job-status.enum';
import { UrlCheckStatus } from '../enums/url-check-status.enum';
import { JobsService } from '../jobs.service';
import { JobsRepository } from '../repositories/jobs.repository';

type LoggerMock = {
  info: jest.Mock<void, [unknown?, string?]>;
  warn: jest.Mock<void, [unknown?, string?]>;
  debug: jest.Mock<void, [unknown?, string?]>;
};

type InngestSendOutput = {
  ids: string[];
};

const createLoggerMock = (): LoggerMock => ({
  info: jest.fn<void, [unknown?, string?]>(),
  warn: jest.fn<void, [unknown?, string?]>(),
  debug: jest.fn<void, [unknown?, string?]>(),
});

const createInngestSendOutput = (): InngestSendOutput => ({
  ids: [],
});

const createInngestSendSpy = () => jest.spyOn(inngest, 'send');

describe('JobsService integration', () => {
  let service: JobsService;
  let repository: JobsRepository;
  let logger: LoggerMock;
  let inngestSendSpy: ReturnType<typeof createInngestSendSpy>;

  beforeEach(async () => {
    logger = createLoggerMock();

    inngestSendSpy = createInngestSendSpy();
    inngestSendSpy.mockResolvedValue(createInngestSendOutput());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        JobsRepository,
        {
          provide: getLoggerToken(JobsService.name),
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get(JobsService);
    repository = module.get(JobsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should create a job, persist it and send URL check events', async () => {
    const response = await service.createJob({
      urls: ['https://example.com', 'https://github.com'],
    });

    expect(response.jobId).toBeDefined();

    const storedJob = repository.findById(response.jobId);
    const details = service.getJobDetails(response.jobId);

    expect(storedJob).toBeDefined();
    expect(details).toMatchObject({
      id: response.jobId,
      status: JobStatus.Pending,
      total: 2,
      processed: 0,
      success: 0,
      error: 0,
      cancelled: 0,
    });

    expect(details.urls).toHaveLength(2);
    expect(details.urls[0]?.status).toBe(UrlCheckStatus.Pending);
    expect(details.urls[1]?.status).toBe(UrlCheckStatus.Pending);

    expect(inngestSendSpy.mock.calls).toEqual([
      [
        [
          {
            name: InngestEventName.UrlCheckRequested,
            data: {
              jobId: response.jobId,
              urlCheckId: details.urls[0]?.id,
              url: 'https://example.com',
            },
          },
          {
            name: InngestEventName.UrlCheckRequested,
            data: {
              jobId: response.jobId,
              urlCheckId: details.urls[1]?.id,
              url: 'https://github.com',
            },
          },
        ],
      ],
    ]);

    expect(logger.info.mock.calls).toHaveLength(2);
  });

  it('should cancel a persisted job and update pending URL checks', async () => {
    const response = await service.createJob({
      urls: ['https://example.com', 'https://github.com'],
    });

    const cancelResponse = await service.cancelJob(response.jobId);
    const details = service.getJobDetails(response.jobId);

    expect(cancelResponse).toEqual({
      jobId: response.jobId,
      status: JobStatus.Cancelled,
    });

    expect(details).toMatchObject({
      id: response.jobId,
      status: JobStatus.Cancelled,
      total: 2,
      processed: 2,
      success: 0,
      error: 0,
      cancelled: 2,
    });

    expect(details.urls[0]?.status).toBe(UrlCheckStatus.Cancelled);
    expect(details.urls[1]?.status).toBe(UrlCheckStatus.Cancelled);

    expect(inngestSendSpy.mock.calls).toHaveLength(2);
    expect(inngestSendSpy.mock.calls[1]).toEqual([
      {
        name: InngestEventName.JobCancelled,
        data: {
          jobId: response.jobId,
        },
      },
    ]);
  });

  it('should update persisted job status when URL checks finish', async () => {
    const response = await service.createJob({
      urls: ['https://example.com', 'https://invalid.example'],
    });

    const initialDetails = service.getJobDetails(response.jobId);

    const firstUrlCheck = initialDetails.urls[0];
    const secondUrlCheck = initialDetails.urls[1];

    if (!firstUrlCheck || !secondUrlCheck) {
      throw new Error('Expected created job to contain two URL checks');
    }

    service.markUrlInProgress(response.jobId, firstUrlCheck.id);
    service.saveUrlSuccess(response.jobId, firstUrlCheck.id, 200);

    const inProgressDetails = service.getJobDetails(response.jobId);

    expect(inProgressDetails.status).toBe(JobStatus.InProgress);
    expect(inProgressDetails.processed).toBe(1);
    expect(inProgressDetails.success).toBe(1);

    service.markUrlInProgress(response.jobId, secondUrlCheck.id);
    service.saveUrlError(response.jobId, secondUrlCheck.id, 'fetch failed');

    const completedDetails = service.getJobDetails(response.jobId);

    expect(completedDetails).toMatchObject({
      id: response.jobId,
      status: JobStatus.Completed,
      total: 2,
      processed: 2,
      success: 1,
      error: 1,
      cancelled: 0,
    });

    expect(completedDetails.urls[0]?.status).toBe(UrlCheckStatus.Success);
    expect(completedDetails.urls[0]?.httpStatus).toBe(200);
    expect(completedDetails.urls[1]?.status).toBe(UrlCheckStatus.Error);
    expect(completedDetails.urls[1]?.error).toBe('fetch failed');
  });

  it('should reject cancelling completed persisted job', async () => {
    const response = await service.createJob({
      urls: ['https://example.com'],
    });

    const details = service.getJobDetails(response.jobId);
    const urlCheck = details.urls[0];

    if (!urlCheck) {
      throw new Error('Expected created job to contain one URL check');
    }

    service.markUrlInProgress(response.jobId, urlCheck.id);
    service.saveUrlSuccess(response.jobId, urlCheck.id, 200);

    inngestSendSpy.mockClear();

    await expect(service.cancelJob(response.jobId)).rejects.toThrow(
      new ConflictException(ERROR_MESSAGES.COMPLETED_JOB_CANNOT_BE_CANCELLED),
    );

    expect(inngestSendSpy.mock.calls).toHaveLength(0);

    const completedDetails = service.getJobDetails(response.jobId);

    expect(completedDetails.status).toBe(JobStatus.Completed);
    expect(completedDetails.success).toBe(1);
  });
});
