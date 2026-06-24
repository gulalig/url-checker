import { styled } from '@mui/material/styles';
import { Grid } from '@/components';

export const LayoutRoot = styled('main')(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  padding: theme.spacing(4),

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const LayoutContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));