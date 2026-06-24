import { yupResolver } from '@hookform/resolvers/yup';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  BUTTON_LABEL,
  CREATE_JOB_FORM_DEFAULT_VALUES,
  CREATE_JOB_FORM_FIELD,
  CREATE_JOB_FORM_LABEL,
  CREATE_JOB_FORM_PLACEHOLDER,
  CREATE_JOB_FORM_FIELD_ID
} from '@/constants';
import { createJobSchema } from '@/schemas';
import type { CreateJobFormValues } from '@/types';
import { parseUrlsInput } from '@/utils';
import {
  FormActions,
  FormHeader,
  FormLabelGroup,
  FormRoot,
  SubmitButton,
  UrlsTextarea,
  FieldErrorText,
} from './styles';
import { createJob, selectCreateJobLoading } from "@/store";
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
      await dispatch(
          createJob({
            urls: parseUrlsInput(values.urls),
          }),
      ).unwrap();

      onJobCreated?.();

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
            <>
              <UrlsTextarea
                  {...field}
                  id={CREATE_JOB_FORM_FIELD_ID.URLS}
                  name={CREATE_JOB_FORM_FIELD.URLS}
                  disabled={isCreateLoading}
                  hasError={Boolean(errors.urls)}
                  rows={6}
                  aria-invalid={Boolean(errors.urls)}
                  aria-describedby={
                    errors.urls ? `${CREATE_JOB_FORM_FIELD_ID.URLS}-error` : undefined
                  }
                  placeholder={CREATE_JOB_FORM_PLACEHOLDER.URLS}
              />

              {errors.urls?.message && (
                  <FieldErrorText id={`${CREATE_JOB_FORM_FIELD_ID.URLS}-error`}>
                    {errors.urls.message}
                  </FieldErrorText>
              )}
            </>
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