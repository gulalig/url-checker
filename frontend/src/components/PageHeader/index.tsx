import type { FC } from 'react';
import { HeaderDescription, HeaderRoot, HeaderTitle } from './styles';

type PageHeaderProps = {
  title: string;
  description: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description }) => (
  <HeaderRoot>
    <HeaderTitle>{title}</HeaderTitle>

    <HeaderDescription>{description}</HeaderDescription>
  </HeaderRoot>
);