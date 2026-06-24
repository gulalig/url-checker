import { styled } from '@mui/material/styles';
import { Chip, Typography, Box, Grid } from '@/components';

export const DetailsRoot = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const DetailsEmptyState = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
}));

export const DetailsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

export const DetailsTitleGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const DetailsTitle = styled(Typography)(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.h2.fontSize,
  fontWeight: theme.typography.h2.fontWeight,
  lineHeight: theme.typography.h2.lineHeight,
}));

export const DetailsId = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontSize: '0.8rem',
  wordBreak: 'break-all',
}));

export const DetailsStatusChip = styled(Chip)(() => ({
  textTransform: 'capitalize',
  fontWeight: 700,
}));

export const StatsGrid = styled(Grid)(({ theme }) => ({
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: theme.spacing(1.5),

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
}));

export const StatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f8fafc',
}));

export const StatLabel = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}));

export const StatValue = styled('strong')(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.primary,
  fontSize: '1.25rem',
  fontWeight: 800,
}));