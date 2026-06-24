import type { FC } from 'react';
import {
  ProgressRoot,
  ProgressTitle,
  ProgressTop,
  ProgressValue,
  StyledProgress,
} from './styles';
import { HelpTooltip } from '@/components';

type JobProgressProps = {
  processed: number;
  total: number;
};

export const JobProgress: FC<JobProgressProps> = ({ processed, total }) => {
  const progressValue = total > 0 ? Math.round((processed / total) * 100) : 0;

  return (
    <ProgressRoot>
      <ProgressTop>
        <ProgressTitle>
          Progress
          <HelpTooltip
            ariaLabel="Progress help"
            title='Shows how many URL checks are already finished, including success, error and cancelled results.'
          />
        </ProgressTitle>
        <ProgressValue>
          {processed} of {total} processed - {progressValue}%
        </ProgressValue>
      </ProgressTop>

      <StyledProgress value={progressValue} variant="determinate" />
    </ProgressRoot>
  );
};