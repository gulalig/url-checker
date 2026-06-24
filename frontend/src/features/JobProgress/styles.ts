import { styled } from '@mui/material/styles';
import { LinearProgress, Typography, Box, Grid } from '@/components';

export const ProgressRoot = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const ProgressTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
}));

export const ProgressTitle = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.h3.fontSize,
  fontWeight: theme.typography.h3.fontWeight,
  lineHeight: theme.typography.h3.lineHeight,
}));

export const ProgressValue = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 700,
}));

export const StyledProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 999,
  backgroundColor: '#e2e8f0',

  '& .MuiLinearProgress-bar': {
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
  },
}));