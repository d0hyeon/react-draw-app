import { ComponentType } from 'react';

export interface ToolComponentProps {
  canvasRef: { current: HTMLCanvasElement | null };
  saveImage: Function;
}
export type Tool = {
  icon?: string;
  Component?: ComponentType<ToolComponentProps>;
};

export type Colors = [string, string];
