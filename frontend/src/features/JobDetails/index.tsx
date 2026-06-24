import type { FC } from 'react';
import { useAppDispatch, useAppSelector, useJobPolling } from '@/hooks';
import {
  cancelJob,
  fetchJobDetails,
  fetchJobs,
  selectActiveJobDetails,
  selectActiveJobId,
  selectCancelJobLoading,
  selectJobDetailsLoading,
  selectJobsError,
} from '@/store';
import type { JobStatus } from '@/types';
import { getJobStatusLabel, isFinalJobStatus } from '@/utils';
import { UrlChecksTable, JobProgress } from '@/features';
import {
  CancelButton,
  DetailsActions,
  DetailsEmptyState,
  DetailsError,
  DetailsHeader,
  DetailsId,
  DetailsRoot,
  DetailsStatusChip,
  DetailsTitle,
  DetailsTitleGroup,
  StatCard,
  StatLabel,
  StatsGrid,
  StatValue,
} from './styles';

type StatusChipColor = 'default' | 'primary' | 'success' | 'error' | 'warning';

//TODO: will move
const getStatusColor = (status: JobStatus): StatusChipColor => {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'cancelled') {
    return 'warning';
  }

  if (status === 'failed') {
    return 'error';
  }

  if (status === 'in_progress') {
    return 'primary';
  }

  return 'default';
};

export const JobDetails: FC = () => {
  const dispatch = useAppDispatch();
  const activeJobId = useAppSelector(selectActiveJobId);
  const details = useAppSelector(selectActiveJobDetails);
  const isDetailsLoading = useAppSelector(selectJobDetailsLoading);
  const isCancelLoading = useAppSelector(selectCancelJobLoading);
  const error = useAppSelector(selectJobsError);

  const canPoll =
    activeJobId !== null &&
    (details === null || !isFinalJobStatus(details.status));

  const canCancel =
    activeJobId !== null &&
    details !== null &&
    !isFinalJobStatus(details.status);

  useJobPolling({
    jobId: activeJobId,
    enabled: canPoll,
  });

  const handleCancel = async (): Promise<void> => {
    if (!activeJobId || !canCancel) {
      return;
    }

    try {
      await dispatch(cancelJob(activeJobId)).unwrap();
      await dispatch(fetchJobs()).unwrap();
      await dispatch(fetchJobDetails(activeJobId)).unwrap();
    } catch {
      // Error state is handled by Redux slice.
    }
  };

  if (!activeJobId) {
    return (
      <DetailsEmptyState>
        Select a job from the list to inspect its details.
      </DetailsEmptyState>
    );
  }

  if (!details) {
    return (
      <DetailsEmptyState>
        {isDetailsLoading
          ? 'Loading job details...'
          : 'Job details are not loaded yet.'}
      </DetailsEmptyState>
    );
  }

  return (
    <DetailsRoot>
      <DetailsHeader>
        <DetailsTitleGroup>
          <DetailsTitle>Job details</DetailsTitle>
          <DetailsId>{details.id}</DetailsId>
        </DetailsTitleGroup>

        <DetailsActions>
          <DetailsStatusChip
            color={getStatusColor(details.status)}
            label={getJobStatusLabel(details.status)}
          />

          <CancelButton
            color="error"
            disabled={!canCancel || isCancelLoading}
            onClick={handleCancel}
            type="button"
            variant="outlined"
          >
            {isCancelLoading ? 'Cancelling...' : 'Cancel job'}
          </CancelButton>
        </DetailsActions>
      </DetailsHeader>

      {error && <DetailsError>{error}</DetailsError>}

      <JobProgress processed={details.processed} total={details.total} />

      <StatsGrid>
        <StatCard>
          <StatLabel>Total</StatLabel>
          <StatValue>{details.total}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Processed</StatLabel>
          <StatValue>{details.processed}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Success</StatLabel>
          <StatValue>{details.success}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Error</StatLabel>
          <StatValue>{details.error}</StatValue>
        </StatCard>

        <StatCard>
          <StatLabel>Cancelled</StatLabel>
          <StatValue>{details.cancelled}</StatValue>
        </StatCard>
      </StatsGrid>

      <UrlChecksTable urls={details.urls} />
    </DetailsRoot>
  );
};