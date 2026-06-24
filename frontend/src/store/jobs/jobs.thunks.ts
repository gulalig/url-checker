import { createAsyncThunk } from '@reduxjs/toolkit';
import { jobsService } from '@/services';
import type {
  CancelJobResponse,
  CreateJobRequest,
  CreateJobResponse,
  JobDetails,
  JobSummary,
} from '@/types';
import { extractErrorMessage } from '@/utils';

type ThunkConfig = {
  rejectValue: string;
};

export const fetchJobs = createAsyncThunk<JobSummary[], void, ThunkConfig>(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      return await jobsService.getJobs();
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const createJob = createAsyncThunk<
  CreateJobResponse,
  CreateJobRequest,
  ThunkConfig
>('jobs/createJob', async (payload, { rejectWithValue }) => {
  try {
    return await jobsService.createJob(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchJobDetails = createAsyncThunk<
  JobDetails,
  string,
  ThunkConfig
>('jobs/fetchJobDetails', async (jobId, { rejectWithValue }) => {
  try {
    return await jobsService.getJobDetails(jobId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const cancelJob = createAsyncThunk<
  CancelJobResponse,
  string,
  ThunkConfig
>('jobs/cancelJob', async (jobId, { rejectWithValue }) => {
  try {
    return await jobsService.cancelJob(jobId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});