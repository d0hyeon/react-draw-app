import { Tool } from 'src/types/toolType';
import { Brash } from './modules/Brash';
import { Selector } from './modules/Selector';
import { Remover } from './modules/Remover';

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
