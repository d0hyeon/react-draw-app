import React from 'react';
import throttle from 'lodash/throttle';
import { BrashNavigation } from './BrashNavigation';
import { ToolComponentProps } from 'src/features/drawing/tools/toolType';
import { createStrokeEvent, StrokeEvent } from 'src/lib/StorkeEvent';

const DEFAULT_CONTEXT_PROPERTIES = {
  globalCompositeOperation: 'source-over',
  lineCap: 'round',
};

declare global {
  interface CanvasRenderingContext2D extends StrokeEvent {}
}

interface Props extends ToolComponentProps {
  globalCompositeOperation?: CanvasRenderingContext2D['globalCompositeOperation']
}

export function Brash ({ id, canvasRef, toolState, layerState, ...props }: Props) {
  const context = layerState.canvas?.getContext?.('2d') || null;

  const onMouseMove = React.useCallback(
    ({ offsetX, offsetY }) => {
      const { strokeX = 0, strokeY = 0, strokeWidth = 0, strokeHeight = 0, lineWidth = 0 } = context;

      if (context.globalCompositeOperation !== 'destination-out') {
        if (strokeX === 0) {
          context.strokeX = offsetX - lineWidth;
        } else if (strokeX > offsetX) {
          context.strokeX = offsetX - lineWidth;
          context.strokeWidth = strokeWidth + strokeX - offsetX + lineWidth;
        } else if (strokeWidth < offsetX - strokeX) {
          context.strokeWidth = offsetX - strokeX + lineWidth;
        }

        if (strokeY === 0) {
          context.strokeY = offsetY - lineWidth;
        } else if (strokeY > offsetY) {
          context.strokeY = offsetY - lineWidth;
          context.strokeHeight = strokeHeight + strokeY - offsetY + lineWidth;
        } else if (strokeHeight < offsetY - strokeY) {
          context.strokeHeight = offsetY - strokeY + lineWidth;
        }
      }
      const strokeEvent = createStrokeEvent({
        strokeX: context.strokeX,
        strokeY: context.strokeY,
        strokeWidth: context.strokeWidth,
        strokeHeight: context.strokeHeight,
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
      canvasRef.current.addEventListener('mousemove', throttledOnMouseMove);
    },
    [context, layerState.canvas, toolState.color, toolState.lineWidth, throttledOnMouseMove],
  );

  const onMouseUp = React.useCallback(() => {
    canvasRef.current.removeEventListener('mousemove', throttledOnMouseMove);
    const contextEvent = new CustomEvent<CanvasRenderingContext2D>('contextChange', {
      detail: context,
    });
    layerState.canvas.dispatchEvent(contextEvent);
  }, [canvasRef, context, throttledOnMouseMove]);

  const onMouseLeave = React.useCallback(() => {
    canvasRef.current.removeEventListener('mousemove', throttledOnMouseMove);
  }, [canvasRef, throttledOnMouseMove]);

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
      canvasRef.current?.addEventListener('mouseleave', onMouseLeave);
      canvasRef.current?.addEventListener('dragstart', onDrag);

      return () => {
        canvasRef.current?.removeEventListener('mousedown', onMouseDown);
        canvasRef.current?.removeEventListener('mousemove', throttledOnMouseMove);
        canvasRef.current?.removeEventListener('mouseup', onMouseUp);
        canvasRef.current?.removeEventListener('mouseleave', onMouseLeave);
        canvasRef.current?.removeEventListener('dragstart', onDrag);
      };
    }
  }, [canvasRef, onMouseDown, throttledOnMouseMove, onMouseUp, onMouseLeave, context]);

  return null;
};

Brash.key = 'brash';
Brash.icon = 'https://img.icons8.com/ios-filled/344/ffffff/marker-pen.png';
Brash.Navigate = BrashNavigation;
