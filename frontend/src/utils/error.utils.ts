import type { ApiErrorResponse } from '@/types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getApiMessage = (message: string | string[] | undefined): string | null => {
  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message ?? null;
};

export const extractErrorMessage = (error: unknown): string => {
  if (isRecord(error) && isRecord(error.response)) {
    const data = error.response.data as ApiErrorResponse | undefined;
    const apiMessage = getApiMessage(data?.message);

    if (apiMessage) {
      return apiMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};