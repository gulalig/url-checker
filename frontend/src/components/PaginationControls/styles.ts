import { styled } from '@mui/material/styles';
import { Box } from '@/components';
import { Pagination } from '@mui/material';

export const PaginationRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'withTopBorder',
})<{ withTopBorder: boolean }>(({ theme, withTopBorder }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  minHeight: 52,
  padding: theme.spacing(1.25, 1.75),
  borderTop: withTopBorder ? `1px solid ${theme.palette.divider}` : 'none',
  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.down('sm')]: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
}));

export const PaginationInfo = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.8rem',
  fontWeight: 700,
}));

export const StyledPagination = styled(Pagination)(() => ({
  '& .MuiPaginationItem-root': {
    borderRadius: 8,
    fontWeight: 800,
  },
}));