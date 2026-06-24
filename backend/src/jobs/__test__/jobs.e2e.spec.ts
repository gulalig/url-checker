import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { inngest } from '../../inngest/inngest.client';
import { JobsRepository } from '../repositories/jobs.repository';
import { AppModule } from '../../app.module';
import { JobStatus } from '../enums/job-status.enum';
import { UrlCheckStatus } from '../enums/url-check-status.enum';
import { ERROR_MESSAGES } from '../../common/constants/error-messages.constant';

type ResponseWithBody = {
  body: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getBody = (response: ResponseWithBody): Record<string, unknown> => {
  if (!isRecord(response.body)) {
    throw new Error('Expected response body to be an object');
  }

  return response.body;
};

const getArrayBody = (response: ResponseWithBody): unknown[] => {
  if (!Array.isArray(response.body)) {
    throw new Error('Expected response body to be an array');
  }

  return response.body;
};

const getStringProperty = (
  record: Record<string, unknown>,
  property: string,
): string => {
  const value = record[property];

  if (typeof value !== 'string') {
    throw new Error(`Expected "${property}" to be a string`);
  }

  return value;
};

const getNumberProperty = (
  record: Record<string, unknown>,
  property: string,
): number => {
  const value = record[property];

  if (typeof value !== 'number') {
    throw new Error(`Expected "${property}" to be a number`);
  }

  return value;
};

const getArrayProperty = (
  record: Record<string, unknown>,
  property: string,
): unknown[] => {
  const value = record[property];

  if (!Array.isArray(value)) {
    throw new Error(`Expected "${property}" to be an array`);
  }

  return value;
};

const getRecordItem = (value: unknown): Record<string, unknown> => {
  if (!isRecord(value)) {
    throw new Error('Expected array item to be an object');
  }

  return value;
};

const createInngestSendOutput = (): Awaited<
  ReturnType<typeof inngest.send>
> => ({
  ids: [],
});

const createInngestSendSpy = () => jest.spyOn(inngest, 'send');

describe('Jobs API e2e', () => {
  let app: INestApplication;
  let httpServer: Server;
  let jobsRepository: JobsRepository;
  let inngestSendSpy: ReturnType<typeof createInngestSendSpy>;

  beforeEach(async () => {
    inngestSendSpy = createInngestSendSpy();
    inngestSendSpy.mockResolvedValue(createInngestSendOutput());

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    httpServer = app.getHttpServer() as Server;
    jobsRepository = moduleFixture.get(JobsRepository);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    await app.close();
  });

  it('should create a job', async () => {
    const response = await request(httpServer)
      .post('/api/jobs')
      .send({
        urls: ['https://example.com', 'https://github.com'],
      })
      .expect(201);

    const body = getBody(response);
    const jobId = getStringProperty(body, 'jobId');

    expect(jobId).toBeDefined();

    const storedJob = jobsRepository.findById(jobId);

    expect(storedJob).toBeDefined();
    expect(storedJob?.status).toBe(JobStatus.Pending);
    expect(storedJob?.urls).toHaveLength(2);

    expect(inngestSendSpy.mock.calls).toHaveLength(1);
  });

  it('should return created jobs list', async () => {
    const createResponse = await request(httpServer)
      .post('/api/jobs')
      .send({
        urls: ['https://example.com'],
      })
      .expect(201);

    const createBody = getBody(createResponse);
    const jobId = getStringProperty(createBody, 'jobId');

    const listResponse = await request(httpServer).get('/api/jobs').expect(200);

    const jobs = getArrayBody(listResponse);

    expect(jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: jobId,
          status: JobStatus.Pending,
          total: 1,
          processed: 0,
          success: 0,
          error: 0,
          cancelled: 0,
        }),
      ]),
    );
  });

  it('should return job details', async () => {
    const createResponse = await request(httpServer)
      .post('/api/jobs')
      .send({
        urls: ['https://example.com', 'https://github.com'],
      })
      .expect(201);

    const createBody = getBody(createResponse);
    const jobId = getStringProperty(createBody, 'jobId');

    const detailsResponse = await request(httpServer)
      .get(`/api/jobs/${jobId}`)
      .expect(200);

    const detailsBody = getBody(detailsResponse);
    const urls = getArrayProperty(detailsBody, 'urls');
    const firstUrl = getRecordItem(urls[0]);
    const secondUrl = getRecordItem(urls[1]);

    expect(getStringProperty(detailsBody, 'id')).toBe(jobId);
    expect(getStringProperty(detailsBody, 'status')).toBe(JobStatus.Pending);
    expect(getNumberProperty(detailsBody, 'total')).toBe(2);
    expect(getNumberProperty(detailsBody, 'processed')).toBe(0);

    expect(urls).toHaveLength(2);

    expect(firstUrl).toMatchObject({
      url: 'https://example.com',
      status: UrlCheckStatus.Pending,
    });

    expect(secondUrl).toMatchObject({
      url: 'https://github.com',
      status: UrlCheckStatus.Pending,
    });
  });

  it('should cancel a job', async () => {
    const createResponse = await request(httpServer)
      .post('/api/jobs')
      .send({
        urls: ['https://example.com', 'https://github.com'],
      })
      .expect(201);

    const createBody = getBody(createResponse);
    const jobId = getStringProperty(createBody, 'jobId');

    const cancelResponse = await request(httpServer)
      .delete(`/api/jobs/${jobId}`)
      .expect(200);

    const cancelBody = getBody(cancelResponse);

    expect(cancelBody).toEqual({
      jobId,
      status: JobStatus.Cancelled,
    });

    const detailsResponse = await request(httpServer)
      .get(`/api/jobs/${jobId}`)
      .expect(200);

    const detailsBody = getBody(detailsResponse);
    const urls = getArrayProperty(detailsBody, 'urls');

    expect(getStringProperty(detailsBody, 'status')).toBe(JobStatus.Cancelled);
    expect(getNumberProperty(detailsBody, 'processed')).toBe(2);
    expect(getNumberProperty(detailsBody, 'cancelled')).toBe(2);

    expect(urls).toHaveLength(2);
    expect(getRecordItem(urls[0])).toMatchObject({
      status: UrlCheckStatus.Cancelled,
    });
    expect(getRecordItem(urls[1])).toMatchObject({
      status: UrlCheckStatus.Cancelled,
    });

    expect(inngestSendSpy.mock.calls).toHaveLength(2);
  });

  it('should return 400 for invalid create job payload', async () => {
    const response = await request(httpServer)
      .post('/api/jobs')
      .send({
        urls: ['example.com'],
      })
      .expect(400);

    const body = getBody(response);

    expect(getNumberProperty(body, 'statusCode')).toBe(400);
  });

  it('should return 404 for missing job details', async () => {
    const response = await request(httpServer)
      .get('/api/jobs/missing-id')
      .expect(404);

    const body = getBody(response);

    expect(getNumberProperty(body, 'statusCode')).toBe(404);
    expect(getStringProperty(body, 'message')).toBe(
      ERROR_MESSAGES.JOB_NOT_FOUND,
    );
  });

  it('should return 409 when cancelling completed job', async () => {
    const createResponse = await request(httpServer)
      .post('/api/jobs')
      .send({
        urls: ['https://example.com'],
      })
      .expect(201);

    const createBody = getBody(createResponse);
    const jobId = getStringProperty(createBody, 'jobId');

    const detailsResponse = await request(httpServer)
      .get(`/api/jobs/${jobId}`)
      .expect(200);

    const detailsBody = getBody(detailsResponse);
    const urls = getArrayProperty(detailsBody, 'urls');
    const urlCheck = getRecordItem(urls[0]);
    const urlCheckId = getStringProperty(urlCheck, 'id');

    jobsRepository.markUrlInProgress(jobId, urlCheckId);
    jobsRepository.saveUrlSuccess(jobId, urlCheckId, 200);

    const cancelResponse = await request(httpServer)
      .delete(`/api/jobs/${jobId}`)
      .expect(409);

    const cancelBody = getBody(cancelResponse);

    expect(getNumberProperty(cancelBody, 'statusCode')).toBe(409);
    expect(getStringProperty(cancelBody, 'message')).toBe(
      ERROR_MESSAGES.COMPLETED_JOB_CANNOT_BE_CANCELLED,
    );
  });
});
