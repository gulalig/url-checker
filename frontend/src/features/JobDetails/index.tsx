import type { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
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
import { getJobStatusLabel, getStatusChipColor, isFinalJobStatus } from '@/utils';
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
import { ButtonContent } from '@/components';
import { BUTTON_LABEL, JOB_DETAILS_COPY } from '@/constants';

export const JobDetails: FC = () => {
  const dispatch = useAppDispatch();
  const activeJobId = useAppSelector(selectActiveJobId);
  const details = useAppSelector(selectActiveJobDetails);
  const isDetailsLoading = useAppSelector(selectJobDetailsLoading);
  const isCancelLoading = useAppSelector(selectCancelJobLoading);
  const error = useAppSelector(selectJobsError);

  const canCancel =
    activeJobId !== null &&
    details !== null &&
    !isFinalJobStatus(details.status);

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
      <DetailsEmptyState>{JOB_DETAILS_COPY.EMPTY}</DetailsEmptyState>
    );
  }

  if (!details) {
    return (
      <DetailsEmptyState>
        {isDetailsLoading
          ? JOB_DETAILS_COPY.LOADING
          : JOB_DETAILS_COPY.NOT_LOADED}
      </DetailsEmptyState>
    );
  }

  return (
    <DetailsRoot>
      <DetailsHeader>
        <DetailsTitleGroup>
          <DetailsTitle>Job details</DetailsTitle>
          <DetailsId title={details.id}>Job #{details.id.slice(0, 8)}</DetailsId>
        </DetailsTitleGroup>

        <DetailsActions>
          <DetailsStatusChip
            color={getStatusChipColor(details.status)}
            label={getJobStatusLabel(details.status)}
          />

          <CancelButton
            color="error"
            disabled={!canCancel || isCancelLoading}
            onClick={handleCancel}
            type="button"
            variant="outlined"
          >
            <ButtonContent
              isLoading={isCancelLoading}
              loadingText={BUTTON_LABEL.CANCELLING}
            >
              {BUTTON_LABEL.CANCEL_JOB}
            </ButtonContent>
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