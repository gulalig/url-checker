import { styled } from '@mui/material/styles';
import { Paper, Box, Typography } from '@/components';

const getCardRadius = (borderRadius: string | number): number =>
  Number(borderRadius) * 1.5;

export const CardRoot = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: getCardRadius(theme.shape.borderRadius),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export const CardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(2),
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.h2.fontSize,
  fontWeight: theme.typography.h2.fontWeight,
  lineHeight: theme.typography.h2.lineHeight,
}));

export const CardDescription = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  lineHeight: theme.typography.body2.lineHeight,
}));