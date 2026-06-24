import { styled } from '@mui/material/styles';
import { Box } from '@/components';

export const ButtonContentRoot = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));