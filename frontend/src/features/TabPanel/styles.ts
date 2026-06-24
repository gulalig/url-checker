import { keyframes, styled } from '@mui/material/styles';
import { Box } from '@/components';

const tabContentEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const TabPanelRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  animation: `${tabContentEnter} 220ms ${theme.transitions.easing.easeOut}`,
}));