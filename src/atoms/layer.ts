import { atomFamily, atom } from 'recoil';
import { nanoid } from 'nanoid';
import { ID } from 'src/types/common';

export interface ContextState {
  strokeX: number;
  strokeY: number;
  strokeWidth: number;
  strokeHeight: number;
  background?: string;
  imageData: ImageData | null;
}

export interface LayerEntity {
  id: ID;
  title: string;
  isDisplay: boolean;
  isLock: boolean;
  canvas: HTMLCanvasElement | null;
  contextState: ContextState;
}

export interface Layer {
  currentLayerId: ID;
  layers: ID[];
}

const INITIAL_LAYER_ENTITY_STATE: LayerEntity = {
  id: '',
  title: '',
  isDisplay: true,
  isLock: false,
  canvas: null,
  contextState: {
    strokeX: 0,
    strokeY: 0,
    strokeWidth: 0,
    strokeHeight: 0,
    imageData: null,
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
      id,
      title: isDefaultLayer ? 'Background' : `Layer-${id}`,
      ...(isDefaultLayer && {
        contextState: {
          ...INITIAL_LAYER_ENTITY_STATE.contextState,
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
