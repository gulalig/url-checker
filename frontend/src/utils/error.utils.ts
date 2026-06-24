import { isHttpClientError } from '@/services';
import type { ApiErrorResponse } from '@/types';

const getApiMessage = (message: string | string[] | undefined): string | null => {
  if (Array.isArray(message)) {
    return message.join(', ');
  }

  return message ?? null;
};

export const extractErrorMessage = (error: unknown): string => {
  if (isHttpClientError<ApiErrorResponse>(error)) {
    const apiMessage = getApiMessage(error.response?.data.message);

    if (apiMessage) {
      return apiMessage;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};