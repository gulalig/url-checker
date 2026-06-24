import { yupResolver } from '@hookform/resolvers/yup';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  CREATE_JOB_FORM_DEFAULT_VALUES,
  CREATE_JOB_FORM_FIELD,
  CREATE_JOB_FORM_LABEL,
  CREATE_JOB_FORM_PLACEHOLDER,
} from '@/constants';
import { createJobSchema } from '@/schemas';
import type { CreateJobFormValues } from '@/types';
import { parseUrlsInput } from '@/utils';
import { FormActions, FormRoot, SubmitButton, UrlsTextarea } from './styles';
import { createJob, fetchJobDetails, fetchJobs, selectCreateJobLoading } from "@/store";
import { useAppDispatch, useAppSelector } from "@/hooks";

export const CreateJobForm: FC = () => {
  const dispatch = useAppDispatch();
  const isCreateLoading = useAppSelector(selectCreateJobLoading);

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setError,
  } = useForm<CreateJobFormValues>({
    defaultValues: CREATE_JOB_FORM_DEFAULT_VALUES,
    mode: 'onChange',
    resolver: yupResolver(createJobSchema),
  });

  const onSubmitForm = async (values: CreateJobFormValues): Promise<void> => {
    try {
      const response = await dispatch(
        createJob({
          urls: parseUrlsInput(values.urls),
        }),
      ).unwrap();

      await dispatch(fetchJobs()).unwrap();
      await dispatch(fetchJobDetails(response.jobId)).unwrap();

      reset(CREATE_JOB_FORM_DEFAULT_VALUES);
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : 'Failed to create job. Please try again.';

      setError(CREATE_JOB_FORM_FIELD.URLS, {
        type: 'server',
        message,
      });
    }
  };

  return (
    <FormRoot noValidate onSubmit={handleSubmit(onSubmitForm)}>
      <Controller
        control={control}
        name={CREATE_JOB_FORM_FIELD.URLS}
        render={({ field }) => (
          <UrlsTextarea
            {...field}
            disabled={isCreateLoading}
            error={Boolean(errors.urls)}
            fullWidth
            helperText={errors.urls?.message}
            label={CREATE_JOB_FORM_LABEL.URLS}
            minRows={6}
            multiline
            placeholder={CREATE_JOB_FORM_PLACEHOLDER.URLS}
          />
        )}
      />

      <FormActions>
        <FormActions>
          <SubmitButton
            disabled={!isValid || isCreateLoading}
            type="submit"
            variant="contained"
          >
            {isCreateLoading ? 'Starting...' : CREATE_JOB_FORM_LABEL.SUBMIT}
          </SubmitButton>
        </FormActions>
      </FormActions>
    </FormRoot>
  );
};