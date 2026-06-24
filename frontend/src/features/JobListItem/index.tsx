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
import type { JobStatus, JobSummary } from '@/types';

const getStatusColor = (
  status: JobStatus,
): 'default' | 'primary' | 'success' | 'error' | 'warning' => {
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

type JobListItemProps = {
  job: JobSummary;
  isActive: boolean;
  onSelect: (jobId: string) => void;
};

export const JobListItem: FC<JobListItemProps> = ({ job, isActive, onSelect }) => {
  const formattedDate = new Date(job.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <JobItemButton isActive={isActive} onClick={() => onSelect(job.id)}>
      <JobItemTop>
        <JobInfo>
          <JobId>{job.id}</JobId>
          <JobDate>{formattedDate}</JobDate>
        </JobInfo>

        <JobStatusChip
          color={getStatusColor(job.status)}
          label={job.status.replace('_', ' ')}
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