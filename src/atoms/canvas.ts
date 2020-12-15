import { atomFamily } from 'recoil';

const INITIAL_STATE = {
  strokeX: 0,
  strokeY: 0,
  strokeWidth: 0,
  strokeHeight: 0,
};

export const canvasFamily = atomFamily({
  key: 'canvas',
  default: INITIAL_STATE,
});
