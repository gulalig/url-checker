import type { FC } from 'react';
import {
  ProgressRoot,
  ProgressTitle,
  ProgressTop,
  ProgressValue,
  StyledProgress,
} from './styles';

type JobProgressProps = {
  processed: number;
  total: number;
};

export const JobProgress: FC<JobProgressProps> = ({ processed, total }) => {
  const progressValue = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <ProgressRoot>
      <ProgressTop>
        <ProgressTitle>Progress</ProgressTitle>
        <ProgressValue>
          {processed} of {total} processed · {progressValue}%
        </ProgressValue>
      </ProgressTop>

      <StyledProgress value={progressValue} variant="determinate" />
    </ProgressRoot>
  );
};