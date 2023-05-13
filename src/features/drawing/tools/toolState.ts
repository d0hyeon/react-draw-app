import { atom } from 'recoil';
import { Colors } from 'src/features/drawing/tools/toolType';
import { ToolKeys } from 'src/features/drawing/tools/modules/config';

export interface ToolState {
  color: string;
  colors: Colors;
  activeTool: ToolKeys;
  lineWidth: number;
}

const INITIAL_STATE: ToolState = {
  colors: ['#000', '#fff'],
  activeTool: 'brash',
  color: '#000',
  lineWidth: 3,
};

export const toolState = atom<ToolState>({
  key: 'tool',
  default: INITIAL_STATE,
});
