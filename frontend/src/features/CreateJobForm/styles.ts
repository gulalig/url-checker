import { styled } from '@mui/material/styles';
import { Button, TextField, Box } from '@/components';

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

export const UrlsTextarea = styled(TextField)(() => ({
  '& textarea': {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
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