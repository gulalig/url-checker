import type { FC } from 'react';
import { JobProgress, UrlChecksTable } from '@/features';
import { useAppSelector } from '@/hooks';
import {
  selectActiveJobDetails,
  selectActiveJobId,
  selectJobDetailsLoading,
} from '@/store';
import type { JobStatus } from '@/types';
import { getJobStatusLabel } from '@/utils';
import {
  DetailsEmptyState,
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
  const activeJobId = useAppSelector(selectActiveJobId);
  const details = useAppSelector(selectActiveJobDetails);
  const isLoading = useAppSelector(selectJobDetailsLoading);

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
        {isLoading ? 'Loading job details...' : 'Job details are not loaded yet.'}
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

        <DetailsStatusChip
          color={getStatusColor(details.status)}
          label={getJobStatusLabel(details.status)}
        />
      </DetailsHeader>

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