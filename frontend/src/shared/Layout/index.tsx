import type { FC, ReactNode } from 'react';
import { LayoutContainer, LayoutRoot } from './styles';

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => (
  <LayoutRoot>
    <LayoutContainer>{children}</LayoutContainer>
  </LayoutRoot>
);