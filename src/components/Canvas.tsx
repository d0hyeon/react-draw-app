import React from 'react';
import { v4 } from 'uuid';
import ToolContext from './context/ToolContext';
import { toolConfigs } from 'src/common/tools';

interface Props {
  defaultWidth: number;
  defaultHeight: number;
}

const Canvas: React.FC<Props> = ({ defaultWidth, defaultHeight }) => {
  const [toolState] = React.useContext(ToolContext);

  const id = v4();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const curreutTool = toolConfigs[toolState.tool];

  curreutTool?.execute?.(canvasRef, toolState);

  return (
    <canvas
      id={`canvas${id}`}
      ref={canvasRef}
      width={defaultWidth}
      height={defaultHeight}
    />
  );
};

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
