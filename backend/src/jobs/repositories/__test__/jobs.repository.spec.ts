import { JobsRepository } from '../jobs.repository';
import { JobStatus } from '../../enums/job-status.enum';
import { UrlCheckStatus } from '../../enums/url-check-status.enum';
import { Job, UrlCheck } from '../../interfaces/job.interface';

describe('JobsRepository', () => {
  let repository: JobsRepository;

  beforeEach(() => {
    repository = new JobsRepository();
  });

  const createJob = (urls: string[]): Job =>
    repository.create({
      urls,
    });

  const getFirstUrlCheck = (job: Job): UrlCheck => {
    const [urlCheck] = job.urls;

    if (!urlCheck) {
      throw new Error('Expected job to contain at least one URL check');
    }

    return urlCheck;
  };

  const getFirstTwoUrlChecks = (job: Job): [UrlCheck, UrlCheck] => {
    const [firstUrlCheck, secondUrlCheck] = job.urls;

    if (!firstUrlCheck || !secondUrlCheck) {
      throw new Error('Expected job to contain two URL checks');
    }

    return [firstUrlCheck, secondUrlCheck];
  };

  const completeUrlCheckAsSuccess = (
    jobId: string,
    urlCheckId: string,
    httpStatus = 200,
  ): void => {
    repository.markUrlInProgress(jobId, urlCheckId);
    repository.saveUrlSuccess(jobId, urlCheckId, httpStatus);
  };

  const completeUrlCheckAsError = (
    jobId: string,
    urlCheckId: string,
    error = 'fetch failed',
  ): void => {
    repository.markUrlInProgress(jobId, urlCheckId);
    repository.saveUrlError(jobId, urlCheckId, error);
  };

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create a pending job with pending URL checks', () => {
    const job = repository.create({
      urls: ['https://example.com', 'https://github.com'],
    });

    expect(job.id).toBeDefined();
    expect(job.createdAt).toBeDefined();
    expect(job.status).toBe(JobStatus.Pending);
    expect(job.urls).toHaveLength(2);

    expect(job.urls[0]).toMatchObject({
      url: 'https://example.com',
      status: UrlCheckStatus.Pending,
    });

    expect(job.urls[1]).toMatchObject({
      url: 'https://github.com',
      status: UrlCheckStatus.Pending,
    });

    expect(repository.findById(job.id)).toEqual(job);
  });

  it('should return jobs sorted by newest first', () => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2026-06-23T10:00:00.000Z'));
    const firstJob = repository.create({
      urls: ['https://example.com'],
    });

    jest.setSystemTime(new Date('2026-06-23T11:00:00.000Z'));
    const secondJob = repository.create({
      urls: ['https://github.com'],
    });

    expect(repository.findAll().map((job) => job.id)).toEqual([
      secondJob.id,
      firstJob.id,
    ]);
  });

  it('should mark a URL check as in progress and set job as in progress', () => {
    const job = repository.create({
      urls: ['https://example.com'],
    });

    const urlCheck = getFirstUrlCheck(job);

    const updatedUrlCheck = repository.markUrlInProgress(job.id, urlCheck.id);
    const updatedJob = repository.findById(job.id);

    expect(updatedUrlCheck).toMatchObject({
      id: urlCheck.id,
      status: UrlCheckStatus.InProgress,
    });

    expect(updatedUrlCheck?.startedAt).toBeDefined();
    expect(updatedJob?.status).toBe(JobStatus.InProgress);
  });

  it('should save successful URL check result and complete the job', () => {
    const job = repository.create({
      urls: ['https://example.com'],
    });

    const urlCheck = getFirstUrlCheck(job);

    repository.markUrlInProgress(job.id, urlCheck.id);

    const result = repository.saveUrlSuccess(job.id, urlCheck.id, 200);
    const updatedJob = repository.findById(job.id);

    expect(result).toMatchObject({
      id: urlCheck.id,
      status: UrlCheckStatus.Success,
      httpStatus: 200,
    });

    expect(result?.finishedAt).toBeDefined();
    expect(result?.durationMs).toBeGreaterThanOrEqual(0);
    expect(updatedJob?.status).toBe(JobStatus.Completed);
  });

  it('should save failed URL check result and complete the job', () => {
    const job = repository.create({
      urls: ['https://invalid.example'],
    });

    const urlCheck = getFirstUrlCheck(job);

    repository.markUrlInProgress(job.id, urlCheck.id);

    const result = repository.saveUrlError(job.id, urlCheck.id, 'fetch failed');
    const updatedJob = repository.findById(job.id);

    expect(result).toMatchObject({
      id: urlCheck.id,
      status: UrlCheckStatus.Error,
      error: 'fetch failed',
    });

    expect(result?.finishedAt).toBeDefined();
    expect(result?.durationMs).toBeGreaterThanOrEqual(0);
    expect(updatedJob?.status).toBe(JobStatus.Completed);
  });

  it('should keep job in progress until all URL checks are final', () => {
    const job = repository.create({
      urls: ['https://example.com', 'https://github.com'],
    });

    const firstUrlCheck = getFirstUrlCheck(job);

    repository.markUrlInProgress(job.id, firstUrlCheck.id);
    repository.saveUrlSuccess(job.id, firstUrlCheck.id, 200);

    expect(repository.findById(job.id)?.status).toBe(JobStatus.InProgress);
  });

  it('should complete job when all URL checks are final', () => {
    const job = createJob(['https://example.com', 'https://invalid.example']);
    const [successCheck, errorCheck] = getFirstTwoUrlChecks(job);

    completeUrlCheckAsSuccess(job.id, successCheck.id);
    completeUrlCheckAsError(job.id, errorCheck.id);

    const completedJob = repository.findById(job.id);

    expect(completedJob?.status).toBe(JobStatus.Completed);
    expect(completedJob?.urls[0].status).toBe(UrlCheckStatus.Success);
    expect(completedJob?.urls[1].status).toBe(UrlCheckStatus.Error);
  });

  it('should cancel pending and in-progress URL checks', () => {
    const job = repository.create({
      urls: ['https://example.com', 'https://github.com'],
    });

    const [inProgressUrlCheck, pendingUrlCheck] = getFirstTwoUrlChecks(job);

    repository.markUrlInProgress(job.id, inProgressUrlCheck.id);

    const cancelledJob = repository.cancel(job.id);

    expect(cancelledJob?.status).toBe(JobStatus.Cancelled);

    const cancelledInProgressCheck = cancelledJob?.urls.find(
      (urlCheck) => urlCheck.id === inProgressUrlCheck.id,
    );
    const cancelledPendingCheck = cancelledJob?.urls.find(
      (urlCheck) => urlCheck.id === pendingUrlCheck.id,
    );

    expect(cancelledInProgressCheck?.status).toBe(UrlCheckStatus.Cancelled);
    expect(cancelledInProgressCheck?.finishedAt).toBeDefined();
    expect(cancelledInProgressCheck?.durationMs).toBeGreaterThanOrEqual(0);

    expect(cancelledPendingCheck?.status).toBe(UrlCheckStatus.Cancelled);
    expect(cancelledPendingCheck?.finishedAt).toBeDefined();
    expect(cancelledPendingCheck?.durationMs).toBeUndefined();
  });

  it('should not overwrite success or error URL checks during cancellation', () => {
    const job = createJob(['https://example.com', 'https://invalid.example']);
    const [successCheck, errorCheck] = getFirstTwoUrlChecks(job);

    completeUrlCheckAsSuccess(job.id, successCheck.id);
    completeUrlCheckAsError(job.id, errorCheck.id);

    const cancelledJob = repository.cancel(job.id);

    expect(cancelledJob?.status).toBe(JobStatus.Cancelled);
    expect(cancelledJob?.urls[0].status).toBe(UrlCheckStatus.Success);
    expect(cancelledJob?.urls[1].status).toBe(UrlCheckStatus.Error);
  });

  it('should not save result when job is cancelled', () => {
    const job = repository.create({
      urls: ['https://example.com'],
    });

    const firstUrlCheck = getFirstUrlCheck(job);

    repository.cancel(job.id);

    const result = repository.saveUrlSuccess(job.id, firstUrlCheck.id, 200);

    expect(result).toBeUndefined();
    expect(repository.findById(job.id)?.status).toBe(JobStatus.Cancelled);
    expect(repository.findById(job.id)?.urls[0].status).toBe(
      UrlCheckStatus.Cancelled,
    );
  });

  it('should return undefined when job does not exist', () => {
    expect(repository.findById('missing-id')).toBeUndefined();
    expect(repository.cancel('missing-id')).toBeUndefined();
    expect(
      repository.markUrlInProgress('missing-id', 'url-check-id'),
    ).toBeUndefined();
    expect(
      repository.saveUrlSuccess('missing-id', 'url-check-id', 200),
    ).toBeUndefined();
    expect(
      repository.saveUrlError('missing-id', 'url-check-id', 'error'),
    ).toBeUndefined();
  });

  it('should not mark job as in progress when URL check does not exist', () => {
    const job = repository.create({
      urls: ['https://example.com'],
    });

    const result = repository.markUrlInProgress(job.id, 'missing-url-check-id');
    const storedJob = repository.findById(job.id);

    expect(result).toBeUndefined();
    expect(storedJob?.status).toBe(JobStatus.Pending);
    expect(storedJob?.urls[0].status).toBe(UrlCheckStatus.Pending);
  });

  it('should not overwrite final URL check result', () => {
    const job = repository.create({
      urls: ['https://example.com'],
    });

    const urlCheck = getFirstUrlCheck(job);

    repository.markUrlInProgress(job.id, urlCheck.id);
    repository.saveUrlSuccess(job.id, urlCheck.id, 200);

    const overwriteResult = repository.saveUrlError(
      job.id,
      urlCheck.id,
      'late error',
    );

    const storedJob = repository.findById(job.id);
    const storedUrlCheck = storedJob?.urls[0];

    expect(overwriteResult).toBeUndefined();
    expect(storedJob?.status).toBe(JobStatus.Completed);
    expect(storedUrlCheck?.status).toBe(UrlCheckStatus.Success);
    expect(storedUrlCheck?.httpStatus).toBe(200);
    expect(storedUrlCheck?.error).toBeUndefined();
  });
});
