import { styled } from '@mui/material/styles';
import { Button, Box } from '@/components';

type UrlsTextareaProps = {
  hasError?: boolean;
};

export const FormRoot = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const FormHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const FormLabelGroup = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 700,
}));

export const UrlsTextarea = styled('textarea', {
  shouldForwardProp: (prop) => prop !== 'hasError',
})<UrlsTextareaProps>(({ theme, hasError }) => ({
  width: '100%',
  minHeight: 144,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
      hasError ? theme.palette.error.main : theme.palette.divider
  }`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontSize: 14,
  lineHeight: 1.5,
  resize: 'vertical',
  outline: 'none',

  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.8,
  },

  '&:focus': {
    borderColor: hasError
        ? theme.palette.error.main
        : theme.palette.primary.main,
  },

  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    cursor: 'not-allowed',
  },
}));

export const FieldErrorText = styled('p')(({ theme }) => ({
  margin: theme.spacing(0.75, 0, 0),
  color: theme.palette.error.main,
  fontSize: 12,
}));

export const FormActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  minWidth: 180,
  paddingInline: theme.spacing(3),
  fontWeight: 700,
}));