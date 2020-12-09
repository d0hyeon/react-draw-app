import { GlobalTools } from './../components/context/ToolContext';
export type Tool = {
  icon?: string;
  execute?: (
    canvasRef: { current: HTMLCanvasElement },
    toolState: GlobalTools,
  ) => void;
};

export type Colors = [string, string];
