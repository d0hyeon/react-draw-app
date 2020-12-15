import React from 'react';
import throttle from 'lodash/throttle';
import { ToolComponentProps } from 'src/types/tool';
import { StrokeEvent } from 'src/types/common';
import { tool } from 'src/atoms/tool';
import { useRecoilState } from 'recoil';

const DEFAULT_CONTEXT_PROPERTIES = {
  globalCompositeOperation: 'source-over',
  lineCap: 'round',
};

declare global {
  interface CanvasRenderingContext2D extends StrokeEvent {}
}

const Brash: React.FC<ToolComponentProps> = ({ canvasRef, ...props }) => {
  const context = canvasRef.current?.getContext?.('2d') || null;
  const [toolState] = useRecoilState(tool);

  const onMouseDown = React.useCallback(
    ({ offsetX, offsetY }) => {
      context.beginPath();
      context.strokeStyle = toolState.color;
      context.lineWidth = toolState.lineWidth;
      context.moveTo(offsetX, offsetY);

      const contextEvent = new CustomEvent<CanvasRenderingContext2D>(
        'contextChange',
        {
          detail: context,
        },
      );
      canvasRef.current.dispatchEvent(contextEvent);
      canvasRef.current.addEventListener('mousemove', throttledOnMouseMove);
    },
    [canvasRef, context, toolState.color, toolState.lineWidth],
  );

  const onMouseMove = React.useCallback(
    ({ offsetX, offsetY }) => {
      let { strokeX = [0, 0], strokeY = [0, 0] } = context;

      if (strokeX[0] === 0) {
        strokeX[0] = offsetX;
      }
      if (strokeY[0] === 0) {
        strokeY[0] = offsetY;
      }

      if (strokeX[0] > offsetX) {
        strokeX[0] = offsetX;
      } else if (strokeX[1] < offsetX) {
        strokeX[1] = offsetX;
      }
      if (strokeY[0] > offsetY) {
        strokeY[0] = offsetY;
      } else if (strokeY[1] < offsetY) {
        strokeY[1] = offsetY;
      }

      context.strokeX = strokeX;
      context.strokeY = strokeY;
      context.lineTo(offsetX, offsetY);
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

  React.useEffect(() => {
    if (context) {
      const configContextProperties = {
        ...DEFAULT_CONTEXT_PROPERTIES,
        ...(props ?? {}),
      };
      Object.entries(configContextProperties).forEach(([key, value]) => {
        context[key] = value;
      });
    }
  }, [context, props]);

  React.useLayoutEffect(() => {
    if (context) {
      canvasRef.current?.addEventListener('mousedown', onMouseDown);
      canvasRef.current?.addEventListener('mouseup', onMouseUp);
      canvasRef.current?.addEventListener('mouseleave', onMouseUp);

      return () => {
        canvasRef.current?.removeEventListener('mousedown', onMouseDown);
        canvasRef.current?.removeEventListener('mouseup', onMouseUp);
        canvasRef.current?.removeEventListener('mouseleave', onMouseUp);
      };
    }
  }, [canvasRef, props, toolState, context]);

  return null;
};

export const key = 'brash';
export const icon =
  'https://img.icons8.com/ios-filled/344/ffffff/marker-pen.png';

export default React.memo(Brash);
