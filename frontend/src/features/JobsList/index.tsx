import {type FC, useEffect, useMemo, useState} from 'react';
import { ButtonContent, CircularProgress, PaginationControls } from '@/components';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
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
import { JobListItem } from '@/features';
import { BUTTON_LABEL, JOBS_LIST_COPY, JOBS_PER_PAGE } from '@/constants';

type JobsListProps = {
  onJobSelected?: () => void;
};

export const JobsList: FC<JobsListProps> = ({ onJobSelected }) => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const [page, setPage] = useState(1);
  const activeJobId = useAppSelector(selectActiveJobId);
  const isLoading = useAppSelector(selectJobsLoading);
  const error = useAppSelector(selectJobsError);

  const pageCount = Math.max(Math.ceil(jobs.length / JOBS_PER_PAGE), 1);
  const safePage = Math.min(page, pageCount);

  const visibleJobs = useMemo(() => {
    const startIndex = (safePage - 1) * JOBS_PER_PAGE;

    return jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [jobs, safePage]);

  useEffect(() => {
    void dispatch(fetchJobs());
  }, [dispatch]);

  const handleRefresh = (): void => {
    void dispatch(fetchJobs());
  };

  const handleSelectJob = (jobId: string): void => {
    dispatch(setActiveJobId(jobId));
    onJobSelected?.();
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
          <ButtonContent isLoading={isLoading} loadingText={BUTTON_LABEL.LOADING}>
            {BUTTON_LABEL.REFRESH}
          </ButtonContent>
        </RefreshButton>
      </JobsListHeader>

      {isLoading && jobs.length === 0 && (
        <LoadingText>
          <CircularProgress size={16} /> {JOBS_LIST_COPY.LOADING}
        </LoadingText>
      )}

      {error && <EmptyState>{error}</EmptyState>}

      {!isLoading && jobs.length === 0 && !error && (
        <EmptyState>{JOBS_LIST_COPY.EMPTY}</EmptyState>
      )}

      {jobs.length > 0 && (
        <>
          <JobsListContent>
            {visibleJobs.map((job) => (
              <JobListItem
                isActive={activeJobId === job.id}
                job={job}
                key={job.id}
                onSelect={handleSelectJob}
              />
            ))}
          </JobsListContent>

          <PaginationControls
            onPageChange={setPage}
            page={safePage}
            pageCount={pageCount}
            pageSize={JOBS_PER_PAGE}
            totalItems={jobs.length}
          />
        </>
      )}
    </JobsListRoot>
  );
};