import axios, { type AxiosError } from 'axios';
import { apiConfig } from "@/services";

export const httpClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const isHttpClientError = <TResponse = unknown>(
  error: unknown,
): error is AxiosError<TResponse> => axios.isAxiosError(error);