import type { ChipProps } from '@mui/material';
import type { JobStatus, UrlCheckStatus } from '@/types';

type StatusValue = JobStatus | UrlCheckStatus;
type StatusChipColor = ChipProps['color'];

const STATUS_CHIP_COLOR_MAP: Record<StatusValue, StatusChipColor> = {
  pending: 'default',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'warning',
  failed: 'error',
  success: 'success',
  error: 'error',
};

export const getStatusChipColor = (status: StatusValue): StatusChipColor =>
  STATUS_CHIP_COLOR_MAP[status];