import * as yup from 'yup';
import { CREATE_JOB_FORM_VALIDATION_MESSAGE } from '@/constants';
import type { CreateJobFormValues } from '@/types';
import {hasDuplicateUrls, parseUrlsInput} from '@/utils';

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const getParsedUrls = (value: string | undefined): string[] => {
  if (!value?.trim()) {
    return [];
  }

  return parseUrlsInput(value);
};

const areUrlsValid = (value: string | undefined): boolean => {
  const urls = getParsedUrls(value);

  if (urls.length === 0) {
    return false;
  }

  return urls.every(isHttpUrl);
};

const areUrlsUnique = (value: string | undefined): boolean => {
  const urls = getParsedUrls(value);

  if (urls.length === 0) {
    return true;
  }

  return !hasDuplicateUrls(urls);
};

export const createJobSchema: yup.ObjectSchema<CreateJobFormValues> =
  yup.object({
    urls: yup
      .string()
      .required(CREATE_JOB_FORM_VALIDATION_MESSAGE.URLS_REQUIRED)
      .test(
        'valid-urls',
        CREATE_JOB_FORM_VALIDATION_MESSAGE.URL_INVALID,
        areUrlsValid,
      )
      .test(
        'unique-urls',
        CREATE_JOB_FORM_VALIDATION_MESSAGE.URL_DUPLICATE,
        areUrlsUnique,
      ),
  });