import { styled } from '@mui/material/styles';
import { Button } from '@/components';

export const HelpIconButton = styled(Button)(({ theme }) => ({
  minWidth: 24,
  width: 24,
  height: 24,
  padding: 0,
  borderRadius: 999,
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#f8fafc',
  fontSize: '0.75rem',
  fontWeight: 900,
  lineHeight: 1,

  '&:hover': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
  },
}));