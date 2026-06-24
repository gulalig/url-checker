import { styled } from '@mui/material/styles';
import { Chip, Box } from '@/components';

export const TableRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
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
  '& td': {
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    fontSize: theme.typography.body2.fontSize,
    verticalAlign: 'top',
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