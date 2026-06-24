import type { FC, ReactNode } from 'react';
import { CircularProgress } from '@/components';
import { ButtonContentRoot } from './styles';

type ButtonContentProps = {
  isLoading: boolean;
  loadingText: string;
  children: ReactNode;
};

export const ButtonContent: FC<ButtonContentProps> = ({ isLoading, loadingText, children }) => (
  <ButtonContentRoot>
    {isLoading && <CircularProgress color="inherit" size={16} thickness={5} />}
    {isLoading ? loadingText : children}
  </ButtonContentRoot>
);