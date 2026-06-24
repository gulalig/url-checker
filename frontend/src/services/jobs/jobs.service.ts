import { API_ENDPOINTS } from '@/constants';
import { httpClient } from '@/services';
import type {
  CancelJobResponse,
  CreateJobRequest,
  CreateJobResponse,
  JobDetails,
  JobSummary,
} from '@/types';

class JobsService {
  async createJob(payload: CreateJobRequest): Promise<CreateJobResponse> {
    const response = await httpClient.post<CreateJobResponse>(
      API_ENDPOINTS.JOBS,
      payload,
    );

    return response.data;
  }

  async getJobs(): Promise<JobSummary[]> {
    const response = await httpClient.get<JobSummary[]>(API_ENDPOINTS.JOBS);

    return response.data;
  }

  async getJobDetails(jobId: string): Promise<JobDetails> {
    const response = await httpClient.get<JobDetails>(
      API_ENDPOINTS.JOB_DETAILS(jobId),
    );

    return response.data;
  }

  async cancelJob(jobId: string): Promise<CancelJobResponse> {
    const response = await httpClient.delete<CancelJobResponse>(
      API_ENDPOINTS.JOB_DETAILS(jobId),
    );

    return response.data;
  }
}

export const jobsService = new JobsService();