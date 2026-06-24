import type { FC, ReactNode } from 'react';
import { CardDescription, CardHeader, CardRoot, CardTitle } from "./styles";

type SectionCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const SectionCard: FC<SectionCardProps> = ({ title, description, children }) => (
  <CardRoot>
    {(title || description) && (
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
    )}

    {children}
  </CardRoot>
);