import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { JobDetails, JobSummary } from '@/types';
import {
  cancelJob,
  createJob,
  fetchJobDetails,
  fetchJobs,
} from '@/store';
import { ERROR_MESSAGE } from '@/constants';

type JobsState = {
  items: JobSummary[];
  activeJobId: string | null;
  activeJobDetails: JobDetails | null;
  isJobsLoading: boolean;
  isCreateLoading: boolean;
  isDetailsLoading: boolean;
  isCancelLoading: boolean;
  error: string | null;
};

const initialState: JobsState = {
  items: [],
  activeJobId: null,
  activeJobDetails: null,
  isJobsLoading: false,
  isCreateLoading: false,
  isDetailsLoading: false,
  isCancelLoading: false,
  error: null,
};

const mapDetailsToSummary = (details: JobDetails): JobSummary => ({
  id: details.id,
  createdAt: details.createdAt,
  status: details.status,
  total: details.total,
  processed: details.processed,
  success: details.success,
  error: details.error,
  cancelled: details.cancelled,
});

const upsertJobSummary = (
  items: JobSummary[],
  summary: JobSummary,
): JobSummary[] => {
  const exists = items.some((item) => item.id === summary.id);

  if (!exists) {
    return [summary, ...items];
  }

  return items.map((item) => (item.id === summary.id ? summary : item));
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setActiveJobId: (state, action: PayloadAction<string | null>) => {
      state.activeJobId = action.payload;
      state.error = null;

      if (!action.payload || state.activeJobDetails?.id !== action.payload) {
        state.activeJobDetails = null;
      }
    },
    clearJobsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isJobsLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isJobsLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isJobsLoading = false;
        state.error = action.payload ?? ERROR_MESSAGE.LOAD_JOBS_FAILED;
      })

      .addCase(createJob.pending, (state) => {
        state.isCreateLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isCreateLoading = false;
        state.activeJobId = action.payload.jobId;
        state.activeJobDetails = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isCreateLoading = false;
        state.error = action.payload ?? ERROR_MESSAGE.CREATE_JOB_FAILED;
      })

      .addCase(fetchJobDetails.pending, (state, action) => {
        if (state.activeJobId !== action.meta.arg) {
          return;
        }

        state.isDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        if (state.activeJobId !== action.payload.id) {
          return;
        }

        state.isDetailsLoading = false;
        state.error = null;
        state.activeJobDetails = action.payload;
        state.items = upsertJobSummary(
          state.items,
          mapDetailsToSummary(action.payload),
        );
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        if (state.activeJobId !== action.meta.arg) {
          return;
        }

        state.isDetailsLoading = false;
        state.error = action.payload ?? ERROR_MESSAGE.LOAD_JOB_DETAILS_FAILED;
      })

      .addCase(cancelJob.pending, (state) => {
        state.isCancelLoading = true;
        state.error = null;
      })
      .addCase(cancelJob.fulfilled, (state, action) => {
        state.isCancelLoading = false;

        state.items = state.items.map((item) =>
          item.id === action.payload.jobId
            ? {
              ...item,
              status: action.payload.status,
            }
            : item,
        );

        if (state.activeJobDetails?.id === action.payload.jobId) {
          state.activeJobDetails.status = action.payload.status;
        }
      })
      .addCase(cancelJob.rejected, (state, action) => {
        state.isCancelLoading = false;
        state.error = action.payload ?? ERROR_MESSAGE.CANCEL_JOB_FAILED;
      });
  },
});

export const { clearJobsError, setActiveJobId } = jobsSlice.actions;

export const jobsReducer = jobsSlice.reducer;