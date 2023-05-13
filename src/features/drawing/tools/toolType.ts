import { ComponentType } from 'react';
import { LayerEntity } from 'src/features/drawing/layer/layerState';
import { ID } from '../../../types/common';
import { ToolState } from './toolState';

interface ExtendsComponentProps {
  id: ID;
  toolState: ToolState;
  layerState: LayerEntity;
  width: number;
  height: number;
}

export interface ToolComponentProps extends ExtendsComponentProps {
  canvasRef: { current: HTMLCanvasElement | null };
}

export type Tool = {
  icon?: string;
  Component: ComponentType<ToolComponentProps>;
  Navigate?: ComponentType;
  props?: Partial<CanvasRenderingContext2D>;
};

export type Colors = [string, string];
