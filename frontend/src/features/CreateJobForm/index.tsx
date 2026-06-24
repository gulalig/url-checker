import { yupResolver } from '@hookform/resolvers/yup';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  BUTTON_LABEL,
  CREATE_JOB_FORM_DEFAULT_VALUES,
  CREATE_JOB_FORM_FIELD,
  CREATE_JOB_FORM_LABEL,
  CREATE_JOB_FORM_PLACEHOLDER,
} from '@/constants';
import { createJobSchema } from '@/schemas';
import type { CreateJobFormValues } from '@/types';
import { parseUrlsInput } from '@/utils';
import {
  FormActions, FormHeader, FormLabelGroup,
  FormRoot,
  SubmitButton,
  UrlsTextarea
} from './styles';
import { createJob, fetchJobDetails, fetchJobs, selectCreateJobLoading } from "@/store";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ButtonContent, HelpTooltip } from "@/components";

type CreateJobFormProps = {
  onJobCreated?: () => void;
};

export const CreateJobForm: FC<CreateJobFormProps> = ({ onJobCreated }) => {
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

      onJobCreated?.();

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
      <FormHeader>
        <FormLabelGroup>
          <span>{CREATE_JOB_FORM_LABEL.URLS}</span>

          <HelpTooltip
            ariaLabel="URL input help"
            title="Enter one URL per line. Each URL must start with http:// or https://."
          />
        </FormLabelGroup>
      </FormHeader>
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
        <SubmitButton
          disabled={!isValid || isCreateLoading}
          type="submit"
          variant="contained"
        >
          <ButtonContent
            isLoading={isCreateLoading}
            loadingText={BUTTON_LABEL.STARTING}
          >
            {BUTTON_LABEL.START_CHECK}
          </ButtonContent>
        </SubmitButton>
      </FormActions>
    </FormRoot>
  );
};