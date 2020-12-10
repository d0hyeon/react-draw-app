import { ComponentType } from 'react';

interface ComponentProps extends Partial<CanvasRenderingContext2D> {
  [key: string]: any;
}

export interface ToolComponentProps extends ComponentProps {
  canvasRef: { current: HTMLCanvasElement | null };
  saveImage: Function;
}

export type Tool = {
  icon?: string;
  Component: ComponentType<ToolComponentProps>;
  Navigate?: ComponentType;
  props?: ComponentProps;
};

export type Colors = [string, string];
