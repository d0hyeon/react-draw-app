import { ComponentType } from 'react';

interface CustomComponentProps extends Partial<CanvasRenderingContext2D> {
  [key: string]: any;
}

export interface ToolComponentProps extends CustomComponentProps {
  canvasRef: { current: HTMLCanvasElement | null };
}

export type Tool = {
  icon?: string;
  Component: ComponentType<ToolComponentProps>;
  Navigate?: ComponentType;
  props?: CustomComponentProps;
};

export type Colors = [string, string];
