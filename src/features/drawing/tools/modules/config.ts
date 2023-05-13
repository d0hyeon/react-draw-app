import { Tool } from 'src/features/drawing/tools/toolType';
import { Brash } from './brash/Brash';
import { Selector } from './Selector';
import { Remover } from './Remover';

export type Tools = {
  [key: string]: Tool;
};

export const toolConfigs: Tools = {
  [Selector.key]: {
    icon: Selector.icon,
    Component: Selector,
  },
  [Brash.key]: {
    icon: Brash.icon,
    Component: Brash,
    Navigate: Brash.Navigate,
  },
  [Remover.key]: {
    icon: Remover.icon,
    Component: Remover,
    Navigate: Remover.Navigate,
  },
};

export type ToolKeys = keyof typeof toolConfigs;
