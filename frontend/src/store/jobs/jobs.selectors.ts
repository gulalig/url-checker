import { RootState } from "@/store";

export const selectJobs = (state: RootState) => state.jobs.items;

export const selectActiveJobId = (state: RootState) => state.jobs.activeJobId;

export const selectActiveJobDetails = (state: RootState) =>
  state.jobs.activeJobDetails;

export const selectJobsLoading = (state: RootState) =>
  state.jobs.isJobsLoading;

export const selectCreateJobLoading = (state: RootState) =>
  state.jobs.isCreateLoading;

export const selectJobDetailsLoading = (state: RootState) =>
  state.jobs.isDetailsLoading;

export const selectCancelJobLoading = (state: RootState) =>
  state.jobs.isCancelLoading;

export const selectJobsError = (state: RootState) => state.jobs.error;