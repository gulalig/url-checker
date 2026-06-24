import * as yup from 'yup';
import { CREATE_JOB_FORM_VALIDATION_MESSAGE } from '@/constants';
import type { CreateJobFormValues } from '@/types';
import { parseUrlsInput } from '@/utils';

const URL_WITH_PROTOCOL_REGEX = /^https?:\/\/\S+$/i;

const areUrlsValid = (value: string | undefined): boolean => {
  if (!value?.trim()) {
    return false;
  }

  const urls = parseUrlsInput(value);

  if (urls.length === 0) {
    return false;
  }

  return urls.every((url) => URL_WITH_PROTOCOL_REGEX.test(url));
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
      ),
  });