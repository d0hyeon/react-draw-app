import React from 'react';
import throttle from 'lodash/throttle';
import { ToolComponentProps } from 'src/types/tool';
import { StrokeEvent } from 'src/types/common';

const DEFAULT_CONTEXT_PROPERTIES = {
  globalCompositeOperation: 'source-over',
  lineCap: 'round',
};

declare global {
  interface CanvasRenderingContext2D extends StrokeEvent {}
}

const Brash: React.FC<ToolComponentProps> = ({ id, canvasRef, toolState, layerState, ...props }) => {
  const context = layerState.canvas?.getContext?.('2d') || null;

  const onMouseMove = React.useCallback(
    ({ offsetX, offsetY }) => {
      const { strokeX, strokeY, strokeWidth, strokeHeight } = context;

      if (strokeX === 0) {
        context.strokeX = offsetX;
      } else if (strokeX > offsetX) {
        context.strokeX = offsetX;
      } else if (strokeWidth < offsetX) {
        context.strokeWidth = offsetX;
      }

      if (strokeY === 0) {
        context.strokeY = offsetY;
      } else if (strokeY > offsetY) {
        context.strokeY = offsetY;
      } else if (strokeHeight < offsetY) {
        context.strokeHeight = offsetY;
      }

      const strokeEvent = new CustomEvent<CanvasRenderingContext2D>('strokeChange', {
        detail: context,
      });
      layerState.canvas.dispatchEvent(strokeEvent);

      context.lineTo(offsetX, offsetY);
      context.stroke();
    },
    [canvasRef, layerState.canvas],
  );
  const throttledOnMouseMove = React.useMemo(() => throttle(onMouseMove, 1000 / 60), [onMouseMove]);

  const onMouseDown = React.useCallback(
    ({ offsetX, offsetY }) => {
      context.beginPath();
      context.strokeStyle = toolState.color;
      context.lineWidth = toolState.lineWidth;
      context.moveTo(offsetX, offsetY);

      const contextEvent = new CustomEvent<CanvasRenderingContext2D>('contextChange', {
        detail: context,
      });
      layerState.canvas.dispatchEvent(contextEvent);
      canvasRef.current.addEventListener('mousemove', throttledOnMouseMove);
    },
    [context, layerState.canvas, toolState.color, toolState.lineWidth, throttledOnMouseMove],
  );

  const onMouseUp = React.useCallback(() => {
    canvasRef.current.removeEventListener('mousemove', throttledOnMouseMove);
  }, [canvasRef, context, throttledOnMouseMove]);

  const onDrag = React.useCallback((e) => {
    e.preventDefault();
  }, []);

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
      canvasRef.current?.addEventListener('dragstart', onDrag);

      return () => {
        canvasRef.current?.removeEventListener('mousedown', onMouseDown);
        canvasRef.current?.removeEventListener('mousemove', throttledOnMouseMove);
        canvasRef.current?.removeEventListener('mouseup', onMouseUp);
        canvasRef.current?.removeEventListener('mouseleave', onMouseUp);
        canvasRef.current?.removeEventListener('dragstart', onDrag);
      };
    }
  }, [canvasRef, onMouseDown, throttledOnMouseMove, onMouseUp, context, toolState.color, toolState.lineWidth]);

  return null;
};

export const key = 'brash';
export const icon = 'https://img.icons8.com/ios-filled/344/ffffff/marker-pen.png';

export default React.memo(Brash);
