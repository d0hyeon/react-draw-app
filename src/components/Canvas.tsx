import React from 'react';
import useSwipe from '@odnh/use-swipe';
import { v4 } from 'uuid';

interface Props {
  width: number;
  height: number;
  tool: string;
  color: string;
}

interface CanvasReffence {
  canvas: HTMLCanvasElement;
}

const Canvas = React.forwardRef<CanvasReffence, Props>(
  ({ width, height, color }, ref) => {
    const id = v4();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const swipe = useSwipe(canvasRef);
    const refferenceValue = React.useRef({
      doneState: 0,
      startY: 0,
      startX: 0,
    });

    const context = canvasRef.current?.getContext('2d');

    React.useEffect(() => {
      const { current } = refferenceValue;

      if (swipe.state === 'move') {
        context.lineTo(current.startX + swipe.x, current.startY + swipe.y);
        context.stroke();
      } else {
        if (refferenceValue.current.doneState === 1) {
          context.strokeStyle = color;
          context.lineWidth = 2.5;
          context.moveTo(current.startX, current.startY);
        } else {
        }
      }
    }, [swipe, color, refferenceValue]);

    React.useLayoutEffect(() => {
      console.log(context);

      const onMouseDown = ({ offsetY, offsetX }) => {
        context?.beginPath();
        refferenceValue.current.doneState = 1;
        refferenceValue.current.startY = offsetY;
        refferenceValue.current.startX = offsetX;
      };
      const onMouseUp = () => {
        context?.closePath();
        refferenceValue.current.doneState = 0;
        refferenceValue.current.startY = 0;
        refferenceValue.current.startX = 0;
      };

      canvasRef.current.addEventListener('mousedown', onMouseDown);
      canvasRef.current.addEventListener('mouseUp', onMouseUp);

      return () => {
        canvasRef.current.removeEventListener('mousedown', onMouseDown);
        canvasRef.current.removeEventListener('mouseUp', onMouseUp);
      };
    }, [canvasRef, context]);

    React.useImperativeHandle(
      ref,
      () => ({
        canvas: canvasRef.current,
      }),
      [canvasRef],
    );

    return (
      <canvas
        id={`canvas${id}`}
        ref={canvasRef}
        width={width}
        height={height}
      />
    );
  },
);

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
