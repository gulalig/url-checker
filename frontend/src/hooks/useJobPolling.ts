import { useEffect } from 'react';
import { JOB_POLLING_INTERVAL_MS } from '@/constants';
import { fetchJobDetails } from '@/store';
import { useAppDispatch } from './useAppDispatch';

type UseJobPollingParams = {
  jobId: string | null;
  enabled: boolean;
};

export const useJobPolling = ({ jobId, enabled }: UseJobPollingParams): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!jobId || !enabled) {
      return undefined;
    }

    const initialRequest = dispatch(fetchJobDetails(jobId));

    const intervalId = window.setInterval(() => {
      void dispatch(fetchJobDetails(jobId));
    }, JOB_POLLING_INTERVAL_MS);

    return () => {
      initialRequest.abort();
      window.clearInterval(intervalId);
    };
  }, [dispatch, enabled, jobId]);
};