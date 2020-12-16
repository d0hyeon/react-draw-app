import { ComponentType } from 'react';
import { ID } from './common';

interface ExtendsComponentProps {
  id: ID;
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
