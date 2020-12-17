import { Tool } from 'src/types/tool';
import * as Brash from 'src/components/tools/Brash';
import BrashNavigate from 'src/components/tools/BrashNavigate';
import * as Selector from 'src/components/tools/Selector';

export type Tools = {
  [key: string]: Tool;
};

export const toolConfigs: Tools = {
  [Selector.key]: {
    icon: Selector.icon,
    Component: Selector.default,
  },
  [Brash.key]: {
    icon: Brash.icon,
    Component: Brash.default,
    Navigate: BrashNavigate,
  },
  eraser: {
    icon: 'https://img.icons8.com/ios-filled/344/ffffff/eraser.png',
    Component: Brash.default,
    Navigate: BrashNavigate,
    props: {
      globalCompositeOperation: 'destination-out',
    },
  },
};

export type ToolKeys = keyof typeof toolConfigs;
