import React from 'react';
import throttle from 'lodash/throttle';
import { ToolComponentProps } from 'src/types/tool';
import { StrokeEvent } from 'src/types/common';
// import { tool } from 'src/atoms/tool';
import { useRecoilState } from 'recoil';
import { layerEntity } from 'src/atoms/layer';

const DEFAULT_CONTEXT_PROPERTIES = {
  globalCompositeOperation: 'source-over',
  lineCap: 'round',
};

declare global {
  interface CanvasRenderingContext2D extends StrokeEvent {}
}

const Brash: React.FC<ToolComponentProps> = ({ id, canvasRef, toolState, ...props }) => {
  const [layerState, setLayerState] = useRecoilState(layerEntity(id));
  const context = layerState.canvas?.getContext?.('2d') || null;

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
    [context, layerState.canvas, toolState.color, toolState.lineWidth],
  );

  const onMouseMove = React.useCallback(
    ({ offsetX, offsetY }) => {
      let { strokeX, strokeY, strokeWidth, strokeHeight } = layerState.contextState;

      if (strokeX === 0) {
        strokeX = offsetX;
      } else if (strokeX > offsetX) {
        strokeX = offsetX;
      } else if (strokeWidth < offsetX) {
        strokeWidth = offsetX;
      }

      if (strokeY === 0) {
        strokeY = offsetY;
      } else if (strokeY > offsetY) {
        strokeY = offsetY;
      } else if (strokeHeight < offsetY) {
        strokeHeight = offsetY;
      }

      setLayerState((prev) => ({
        ...prev,
        contextState: {
          ...prev.contextState,
          strokeX,
          strokeY,
          strokeWidth,
          strokeHeight,
        },
      }));

      context.lineTo(offsetX, offsetY);
      context.stroke();
    },
    [canvasRef, context, layerState],
  );
  const throttledOnMouseMove = React.useMemo(() => throttle(onMouseMove, 1000 / 60), [onMouseMove]);

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
export const icon = 'https://img.icons8.com/ios-filled/344/ffffff/marker-pen.png';

export default React.memo(Brash);
