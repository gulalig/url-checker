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

export const CreateJobForm: FC = () => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<CreateJobFormValues>({
    defaultValues: CREATE_JOB_FORM_DEFAULT_VALUES,
    mode: 'onChange',
    resolver: yupResolver(createJobSchema),
  });

  const onSubmit = (values: CreateJobFormValues): void => {
    const urls = parseUrlsInput(values.urls);

    console.log('Parsed URLs:', urls);

    reset(CREATE_JOB_FORM_DEFAULT_VALUES);
  };

  return (
    <FormRoot noValidate onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name={CREATE_JOB_FORM_FIELD.URLS}
        render={({ field }) => (
          <UrlsTextarea
            {...field}
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
        <SubmitButton disabled={!isValid} type="submit" variant="contained">
          {CREATE_JOB_FORM_LABEL.SUBMIT}
        </SubmitButton>
      </FormActions>
    </FormRoot>
  );
};