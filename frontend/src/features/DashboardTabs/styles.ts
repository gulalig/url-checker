import { styled } from '@mui/material/styles';
import { Paper, Tabs, Box } from '@/components';

export const DashboardTabsRoot = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.06)',
}));

export const DashboardTabsHeader = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#f8fafc',
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 56,
  paddingInline: theme.spacing(2),

  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 999,
  },

  '& .MuiTab-root': {
    minHeight: 56,
    color: theme.palette.text.secondary,
    fontWeight: 800,
    textTransform: 'none',
  },

  '& .Mui-selected': {
    color: theme.palette.primary.main,
  },

  [theme.breakpoints.down('sm')]: {
    paddingInline: theme.spacing(1),

    '& .MuiTab-root': {
      minWidth: 'auto',
      paddingInline: theme.spacing(1.25),
      fontSize: '0.8rem',
    },
  },
}));

export const DashboardTabsContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));