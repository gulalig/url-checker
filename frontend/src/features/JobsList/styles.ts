import { styled } from '@mui/material/styles';
import { Button, Typography, Box, Grid } from '@/components';

export const JobsListRoot = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const JobsListHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1),

  [theme.breakpoints.down('sm')]: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
}));

export const JobsListTitle = styled(Typography)(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.h2.fontSize,
  fontWeight: theme.typography.h2.fontWeight,
  lineHeight: theme.typography.h2.lineHeight,
}));

export const RefreshButton = styled(Button)(({ theme }) => ({
  minWidth: 120,
  fontWeight: 700,
  paddingInline: theme.spacing(2),
}));

export const JobsListContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const EmptyState = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
}));

export const LoadingText = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
}));