export const API_ENDPOINTS = {
  JOBS: '/jobs',
  JOB_DETAILS: (jobId: string): string => `/jobs/${jobId}`,
} as const;