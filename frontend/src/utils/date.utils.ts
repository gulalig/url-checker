export const formatDateTime = (value: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const formatOptionalDateTime = (value: string | undefined): string =>
  value ? formatDateTime(value) : '-';

export const formatDurationMs = (value: number | undefined): string => {
  if (value === undefined) {
    return '-';
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  return `${(value / 1000).toFixed(1)} s`;
};