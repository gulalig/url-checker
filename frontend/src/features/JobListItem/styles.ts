import { styled } from '@mui/material/styles';
import { Button, Chip, Box } from '@/components';

export const JobItemButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.75, 2),
  border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: 16,
  backgroundColor: isActive ? 'rgba(37, 99, 235, 0.06)' : theme.palette.background.paper,
  cursor: 'pointer',
  textAlign: 'left',
  textTransform: 'none',
  boxShadow: isActive ? '0 8px 24px rgba(37, 99, 235, 0.08)' : 'none',
  transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',

  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(37, 99, 235, 0.04)',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
  },
}));

export const JobItemTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
}));

export const JobId = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.primary,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontSize: '0.82rem',
  fontWeight: 700,
  lineHeight: 1.4,
  wordBreak: 'break-all',
}));

export const JobDate = styled('span')(({ theme }) => ({
  display: 'block',
  marginTop: theme.spacing(0.35),
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  fontWeight: 600,
}));

export const JobStatusChip = styled(Chip)(({ theme }) => ({
  height: 24,
  alignSelf: 'flex-start',
  borderRadius: 999,
  textTransform: 'capitalize',
  fontSize: '0.75rem',
  fontWeight: 800,
  paddingInline: theme.spacing(0.5),
  whiteSpace: 'nowrap',
}));

export const JobStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}));

export const JobStat = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 24,
  padding: theme.spacing(0.35, 1),
  borderRadius: 999,
  backgroundColor: '#f8fafc',
  color: theme.palette.text.secondary,
  fontSize: '0.76rem',
  fontWeight: 700,
  lineHeight: 1,
}));

export const JobInfo = styled(Box)(() => ({
  minWidth: 0,
}));