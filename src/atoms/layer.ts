import { atomFamily, atom } from 'recoil';
import { nanoid } from 'nanoid';
import { ID } from 'src/types/common';

export interface LayerEntity {
  title: string;
  isDisplay: boolean;
  isLock: boolean;
  canvas?: HTMLCanvasElement | null;
  context: {
    strokeX: number;
    strokeY: number;
    strokeWidth: number;
    strokeHeight: number;
    background?: string;
  };
}

interface Layer {
  currentLayerId: ID;
  layers: ID[];
}

const INITIAL_LAYER_ENTITY_STATE: LayerEntity = {
  title: '',
  isDisplay: true,
  isLock: false,
  context: {
    strokeX: 0,
    strokeY: 0,
    strokeWidth: 0,
    strokeHeight: 0,
    background: '',
  },
};
const DEFAULT_LAYER_ID: ID = nanoid();
const INITIAL_LAYER_STATE: Layer = {
  currentLayerId: DEFAULT_LAYER_ID,
  layers: [DEFAULT_LAYER_ID],
};

export const layerEntity = atomFamily<LayerEntity, ID>({
  key: 'layerEntity',
  default: (id) => {
    const isDefaultLayer = id === DEFAULT_LAYER_ID;
    return {
      ...INITIAL_LAYER_ENTITY_STATE,
      title: isDefaultLayer ? 'background' : `layer-${id}`,
      ...(isDefaultLayer && {
        context: {
          ...INITIAL_LAYER_ENTITY_STATE.context,
          background: '#fff',
        },
      }),
    };
  },
});

export const layer = atom<Layer>({
  key: 'layer',
  default: INITIAL_LAYER_STATE,
});
