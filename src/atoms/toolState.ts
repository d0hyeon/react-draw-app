import { atom } from 'recoil';
import { Colors } from 'src/types/toolType';
import { ToolKeys } from 'src/components/tools/config';

export interface ToolState {
  color: string;
  colors: Colors;
  tool: ToolKeys;
  lineWidth: number;
}

const INITIAL_STATE: ToolState = {
  colors: ['#000', '#fff'],
  tool: 'brash',
  color: '#000',
  lineWidth: 3,
};

export const tool = atom<ToolState>({
  key: 'tool',
  default: INITIAL_STATE,
});
