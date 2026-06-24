const formatMilliseconds = (value: number): string =>
  value.toString().padStart(3, '0');

export const formatDateTime = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const datePart = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  return `${datePart}, ${timePart}.${formatMilliseconds(date.getMilliseconds())}`;
};

export const formatOptionalDateTime = (value: string | undefined): string =>
  value ? formatDateTime(value) : '-';

export const formatDurationMs = (value: number | undefined): string => {
  if (value === undefined) {
    return '-';
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  const seconds = Math.floor(value / 1000);
  const milliseconds = String(value % 1000).padStart(3, '0');

  return `${seconds}.${milliseconds} s`;
};