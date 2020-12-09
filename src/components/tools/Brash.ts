import React from 'react';
import throttle from 'lodash/throttle';
import { ToolComponentProps } from 'src/types/tool';
import ToolContext from 'src/components/context/ToolContext';

const Brash: React.FC<ToolComponentProps> = ({ canvasRef, saveImage }) => {
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null,
  );
  const [toolState] = React.useContext(ToolContext);

  const onMouseDown = React.useCallback(
    (event: MouseEvent) => {
      context.beginPath();
      context.strokeStyle = toolState.color;
      context.lineWidth = 2.5;
      context.moveTo(event.offsetX, event.offsetY);
      saveImage();
      canvasRef.current.addEventListener('mousemove', throttledOnMouseMove);
    },
    [canvasRef, context, toolState.color],
  );

  const onMouseMove = React.useCallback(
    (event: MouseEvent) => {
      context.lineTo(event.offsetX, event.offsetY);
      context.stroke();
    },
    [canvasRef, context],
  );
  const throttledOnMouseMove = React.useMemo(
    () => throttle(onMouseMove, 1000 / 60),
    [onMouseMove],
  );

  const onMouseUp = React.useCallback(() => {
    canvasRef.current.removeEventListener('mousemove', throttledOnMouseMove);
  }, [canvasRef, context]);

  React.useLayoutEffect(() => {
    if (context === null) {
      setContext(canvasRef.current.getContext('2d'));
    } else {
      canvasRef.current?.addEventListener('mousedown', onMouseDown);
      canvasRef.current?.addEventListener('mouseup', onMouseUp);
      canvasRef.current?.addEventListener('mouseleave', onMouseUp);

      return () => {
        canvasRef.current?.removeEventListener('mousedown', onMouseDown);
        canvasRef.current?.removeEventListener('mouseup', onMouseUp);
        canvasRef.current?.removeEventListener('mouseleave', onMouseUp);
      };
    }
  }, [canvasRef, toolState.color, context]);

  return null;
};

export const key = 'brash';
export const icon =
  'https://img.icons8.com/ios-filled/344/ffffff/marker-pen.png';

export default React.memo(Brash);
