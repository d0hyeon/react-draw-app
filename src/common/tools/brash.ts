import React from 'react';
import throttle from 'lodash/throttle';

const BrashExecute = (canvasRef, config) => {
  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null,
  );
  // const context = canvasRef.current?.getContext('2d');
  const onMouseDown = React.useCallback(
    (event: MouseEvent) => {
      console.log(config.color);
      context.beginPath();
      context.strokeStyle = config.color;
      context.lineWidth = 2.5;
      context.moveTo(event.offsetX, event.offsetY);
      canvasRef.current.addEventListener('mousemove', throttledOnMouseMove);
    },
    [canvasRef, context, config.color],
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
      canvasRef.current.addEventListener('mousedown', onMouseDown);
      canvasRef.current.addEventListener('mouseup', onMouseUp);
      canvasRef.current.addEventListener('mouseleave', onMouseUp);

      return () => {
        canvasRef.current.removeEventListener('mousedown', onMouseDown);
        canvasRef.current.removeEventListener('mouseup', onMouseUp);
        canvasRef.current.removeEventListener('mouseleave', onMouseUp);
      };
    }
  }, [canvasRef, config.color, context]);
};

export default {
  key: 'brash',
  icon: 'https://www.flaticon.com/svg/static/icons/svg/2050/2050922.svg',
  execute: BrashExecute,
};
