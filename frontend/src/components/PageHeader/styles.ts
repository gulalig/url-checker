import { styled } from '@mui/material/styles';
import { Typography } from "@/components";

const getCardRadius = (borderRadius: string | number): number =>
  Number(borderRadius) * 1.5;

export const HeaderRoot = styled('header')(({ theme }) => ({
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: getCardRadius(theme.shape.borderRadius),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  maxWidth: 760,
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.h1.fontSize,
  fontWeight: theme.typography.h1.fontWeight,
  letterSpacing: theme.typography.h1.letterSpacing,
  lineHeight: theme.typography.h1.lineHeight,
}));

export const HeaderDescription = styled('p')(({ theme }) => ({
  maxWidth: 760,
  margin: 0,
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body1.fontSize,
  lineHeight: theme.typography.body1.lineHeight,
}));