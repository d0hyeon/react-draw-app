import React from 'react';
import throttle from 'lodash/throttle';
import { ToolComponentProps } from 'src/types/tool';
import ToolContext from 'src/components/context/ToolContext';
import { StrokeEvent } from 'src/types/common';

const DEFAULT_CONTEXT_PROPERTIES = {
  globalCompositeOperation: 'source-over',
};

declare global {
  interface CanvasRenderingContext2D extends StrokeEvent {}
}

const Brash: React.FC<ToolComponentProps> = ({
  canvasRef,
  saveImage,
  ...props
}) => {
  const context = canvasRef.current?.getContext?.('2d') || null;
  const [toolState] = React.useContext(ToolContext);

  const onMouseDown = React.useCallback(
    ({ offsetX, offsetY }) => {
      context.beginPath();
      context.strokeStyle = toolState.color;
      context.lineWidth = toolState.lineWidth;
      context.moveTo(offsetX, offsetY);

      saveImage();
      canvasRef.current.addEventListener('mousemove', throttledOnMouseMove);
    },
    [canvasRef, context, toolState.color, toolState.lineWidth],
  );

  const onMouseMove = React.useCallback(
    ({ offsetX, offsetY }) => {
      const {
        strokeX = 0,
        strokeY = 0,
        strokeWidth = 0,
        strokeHeight = 0,
      } = context;
      let changeCnt = 0;
      if (strokeWidth <= offsetX - strokeX) {
        context.strokeWidth = offsetX - strokeX;
        changeCnt++;
      }
      if (strokeHeight <= offsetY - strokeY) {
        context.strokeHeight = offsetY - strokeY;
        changeCnt++;
      }
      if (strokeX >= offsetX || strokeX === 0) {
        context.strokeX = offsetX;
        changeCnt++;
      }
      if (strokeY >= offsetY || strokeY === 0) {
        context.strokeY = offsetY;
        changeCnt++;
      }

      if (changeCnt > 0) {
        const strokeEvent = new CustomEvent<StrokeEvent>('strokeChange', {
          detail: context,
        });

        canvasRef.current.dispatchEvent(strokeEvent);
      }

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
