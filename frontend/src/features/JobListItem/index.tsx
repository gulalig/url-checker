import { type FC } from 'react';
import {
  JobItemButton,
  JobItemTop,
  JobId,
  JobDate,
  JobStatusChip,
  JobStats,
  JobStat,
  JobInfo,
} from './styles';
import type { JobSummary } from '@/types';
import { formatDateTime, getJobStatusLabel, getStatusChipColor } from '@/utils';

type JobListItemProps = {
  job: JobSummary;
  isActive: boolean;
  onSelect: (jobId: string) => void;
};

export const JobListItem: FC<JobListItemProps> = ({ job, isActive, onSelect }) => {
  const formattedDate = formatDateTime(job.createdAt);

  const getJobDisplayId = (id: string): string =>
    `Job #${id.slice(0, 8)}`;

  return (
    <JobItemButton isActive={isActive} onClick={() => onSelect(job.id)}>
      <JobItemTop>
        <JobInfo>
          <JobId title={job.id}>{getJobDisplayId(job.id)}</JobId>
          <JobDate>{formattedDate}</JobDate>
        </JobInfo>

        <JobStatusChip
          color={getStatusChipColor(job.status)}
          label={getJobStatusLabel(job.status)}
          size="small"
        />
      </JobItemTop>

      <JobStats>
        <JobStat>Total: {job.total}</JobStat>
        <JobStat>Processed: {job.processed}</JobStat>
        <JobStat>Success: {job.success}</JobStat>
        <JobStat>Error: {job.error}</JobStat>
        <JobStat>Cancelled: {job.cancelled}</JobStat>
      </JobStats>
    </JobItemButton>
  );
};