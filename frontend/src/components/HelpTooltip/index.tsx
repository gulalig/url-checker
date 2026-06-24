import type { FC } from 'react';
import { Tooltip } from '@/components';
import { HelpIconButton } from './styles';

type HelpTooltipProps = {
  title: string;
  ariaLabel: string;
};

export const HelpTooltip: FC<HelpTooltipProps> = ({ title, ariaLabel }) => (
  <Tooltip arrow placement="top" title={title}>
    <HelpIconButton aria-label={ariaLabel} type="button">
      ?
    </HelpIconButton>
  </Tooltip>
);