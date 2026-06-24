import { styled } from '@mui/material/styles';
import { Chip, Box } from '@/components';

export const TableRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

export const TableScroll = styled(Box)(() => ({
  width: '100%',
  minHeight: 256,
  overflowX: 'auto',
  flexShrink: 0,
}));

export const Table = styled('table')(({ theme }) => ({
  width: '100%',
  minWidth: 900,
  borderCollapse: 'collapse',
  backgroundColor: theme.palette.background.paper,
}));

export const TableHead = styled('thead')(({ theme }) => ({
  backgroundColor: '#f8fafc',

  '& th': {
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    fontWeight: 800,
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
}));

export const TableBody = styled('tbody')(({ theme }) => ({
  '& tr': {
    height: 42,
  },

  '& td': {
    height: 42,
    padding: theme.spacing(1, 1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    fontSize: theme.typography.body2.fontSize,
    verticalAlign: 'middle',
  },

  '& tr:last-child td': {
    borderBottom: 0,
  },
}));

export const UrlCell = styled('span')(() => ({
  display: 'block',
  maxWidth: 320,
  wordBreak: 'break-all',
}));

export const MutedText = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ErrorText = styled('span')(({ theme }) => ({
  display: 'block',
  maxWidth: 260,
  color: theme.palette.error.main,
  wordBreak: 'break-word',
}));

export const UrlStatusChip = styled(Chip)(() => ({
  textTransform: 'capitalize',
  fontWeight: 700,
}));

export const FilterToolbar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#f8fafc',

  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
}));

export const FilterLabel = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.78rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}));

export const FilterGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(0.75),

  [theme.breakpoints.down('sm')]: {
    justifyContent: 'flex-start',
  },
}));

export const FilterChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
  height: 26,
  borderRadius: 999,
  fontSize: '0.75rem',
  fontWeight: 800,
  opacity: isActive ? 1 : 0.78,
}));

export const TableEmptyState = styled('p')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: 700,
}));