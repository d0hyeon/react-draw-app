import { Tool } from 'src/types/tool';
import * as Brash from 'src/components/tools/Brash';

export type Tools = {
  [key: string]: Tool;
};

export const toolConfigs: Tools = {
  [Brash.key]: {
    icon: Brash.icon,
    Component: Brash.default,
  },
};

export type ToolKeys = keyof typeof toolConfigs;
