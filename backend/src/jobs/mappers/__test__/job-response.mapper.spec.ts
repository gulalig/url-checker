import { Job } from '../../interfaces/job.interface';
import { JobStatus } from '../../enums/job-status.enum';
import { UrlCheckStatus } from '../../enums/url-check-status.enum';
import {
  getJobStats,
  mapJobToDetails,
  mapJobToSummary,
} from '../job-response.mapper';

describe('job-response.mapper', () => {
  const job: Job = {
    id: 'job-id',
    createdAt: '2026-06-23T10:00:00.000Z',
    status: JobStatus.Completed,
    urls: [
      {
        id: 'url-check-1',
        url: 'https://example.com',
        status: UrlCheckStatus.Success,
        httpStatus: 200,
      },
      {
        id: 'url-check-2',
        url: 'https://invalid.example',
        status: UrlCheckStatus.Error,
        error: 'fetch failed',
      },
      {
        id: 'url-check-3',
        url: 'https://cancelled.example',
        status: UrlCheckStatus.Cancelled,
      },
      {
        id: 'url-check-4',
        url: 'https://pending.example',
        status: UrlCheckStatus.Pending,
      },
    ],
  };

  it('should calculate job statistics', () => {
    expect(getJobStats(job)).toEqual({
      total: 4,
      processed: 3,
      success: 1,
      error: 1,
      cancelled: 1,
    });
  });

  it('should map job to summary response', () => {
    expect(mapJobToSummary(job)).toEqual({
      id: job.id,
      createdAt: job.createdAt,
      status: job.status,
      total: 4,
      processed: 3,
      success: 1,
      error: 1,
      cancelled: 1,
    });
  });

  it('should map job to details response', () => {
    expect(mapJobToDetails(job)).toEqual({
      id: job.id,
      createdAt: job.createdAt,
      status: job.status,
      urls: job.urls,
      total: 4,
      processed: 3,
      success: 1,
      error: 1,
      cancelled: 1,
    });
  });
});
