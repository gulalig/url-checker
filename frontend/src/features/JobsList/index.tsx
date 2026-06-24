import { type FC, useEffect } from 'react';
import { CircularProgress } from '@/components';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  fetchJobDetails,
  fetchJobs,
  selectActiveJobId,
  selectJobs,
  selectJobsError,
  selectJobsLoading,
  setActiveJobId,
} from '@/store';
import {
  EmptyState,
  JobsListContent,
  JobsListHeader,
  JobsListRoot,
  JobsListTitle,
  LoadingText,
  RefreshButton,
} from './styles';
import { JobListItem } from "../JobListItem";

export const JobsList: FC = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const activeJobId = useAppSelector(selectActiveJobId);
  const isLoading = useAppSelector(selectJobsLoading);
  const error = useAppSelector(selectJobsError);

  useEffect(() => {
    void dispatch(fetchJobs());
  }, [dispatch]);

  const handleRefresh = (): void => {
    void dispatch(fetchJobs());
  };

  const handleSelectJob = (jobId: string): void => {
    dispatch(setActiveJobId(jobId));
    void dispatch(fetchJobDetails(jobId));
  };

  return (
    <JobsListRoot>
      <JobsListHeader>
        <JobsListTitle>Jobs</JobsListTitle>

        <RefreshButton
          disabled={isLoading}
          onClick={handleRefresh}
          type="button"
          variant="outlined"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </RefreshButton>
      </JobsListHeader>

      {isLoading && jobs.length === 0 && (
        <LoadingText>
          <CircularProgress size={16} /> Loading jobs...
        </LoadingText>
      )}

      {error && <EmptyState>{error}</EmptyState>}

      {!isLoading && jobs.length === 0 && !error && (
        <EmptyState>No jobs yet. Create your first URL check job.</EmptyState>
      )}

      {jobs.length > 0 && (
        <JobsListContent>
          {jobs.map((job) => (
            <JobListItem
              isActive={activeJobId === job.id}
              job={job}
              key={job.id}
              onSelect={handleSelectJob}
            />
          ))}
        </JobsListContent>
      )}
    </JobsListRoot>
  );
};