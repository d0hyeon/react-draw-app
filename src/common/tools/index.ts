import { Tool } from 'src/types/tool';
import brash from './brash';

export type Tools = {
  [key: string]: Tool;
};

export const toolConfigs: Tools = {
  [brash.key]: brash,
};

export type ToolKeys = keyof typeof toolConfigs;
