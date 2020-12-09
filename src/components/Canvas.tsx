import React from 'react';
import useSwipe from '@odnh/use-swipe';
import { v4 } from 'uuid';
import ToolContext from './context/ToolContext';
import useHistory from 'src/hooks/useHistory';

interface Props {
  defaultWidth: number;
  defaultHeight: number;
}

const Canvas: React.FC<Props> = ({ defaultWidth, defaultHeight }) => {
  const [{ color }] = React.useContext(ToolContext);

  const id = v4();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const swipe = useSwipe(canvasRef);
  const refValues = React.useRef({
    isMoving: true,
    doneState: 0,
    startY: 0,
    startX: 0,
  });
  // const [startEvent, setStartEvent] = React.useState<MouseEvent | null>(null);
  const [drawState, setDrawState] = React.useState<'start' | 'move' | 'end'>(
    'end',
  );

  const context = React.useMemo(() => canvasRef.current?.getContext('2d'), [
    canvasRef.current,
  ]);

  const { history, historyPop, historyPush } = useHistory();
  React.useEffect(() => {}, [history.length, history]);

  const prev = () => {
    const prevImageData = historyPop();
    console.log(prevImageData);
    if (prevImageData) {
      context.putImageData(prevImageData, 0, 0);
    }
  };

  React.useEffect(() => {
    let isPressControl = false;
    const onKeydown = (event) => {
      const keycode = event.keyCode || event.which;
      if (keycode === 17) {
        isPressControl = true;
      }
    };

    const onKeyup = (event) => {
      const keycode = event.keyCode || event.which;
      if (isPressControl && keycode === 90) {
        prev();
      }
      if (keycode === 17) {
        isPressControl = false;
      }
    };
    // const onKeyUp = () => {};
    document.body.addEventListener('keydown', onKeydown);
    document.body.addEventListener('keyup', onKeyup);

    return () => {
      document.body.removeEventListener('keydown', onKeydown);
      document.body.removeEventListener('keyup', onKeyup);
    };
  }, [history, context]);

  React.useEffect(() => {
    if (drawState === 'end') {
      const canvasImage = canvasRef.current
        .getContext('2d')
        .getImageData(0, 0, defaultWidth, defaultHeight);
      historyPush(canvasImage);
    }
  }, [context, drawState, history, historyPush]);

  React.useEffect(() => {
    const { current } = refValues;

    if (swipe.state === 'move') {
      context.lineTo(current.startX + swipe.x, current.startY + swipe.y);
      context.stroke();
    } else {
      if (drawState === 'start') {
        context.strokeStyle = color;
        context.lineWidth = 2.5;
        context.moveTo(current.startX, current.startY);
      } else {
        setTimeout(() => {}, 200);
      }
    }
  }, [
    swipe,
    color,
    context,
    drawState,
    history,
    historyPush,
    defaultWidth,
    defaultHeight,
  ]);
  // @TODO
  // useHistoryState
  // moveEvent -> callback -> excute a 'setHistoryState' at the return value -> value push in history stack -> (ctrl + z) -> pop in history stack
  // const onMoveStart = React.useCallback(
  //   (event) => {
  //     if (!refValues.current.isMoving) {
  //       return;
  //     }
  //     setStartEvent(event);
  //     refValues.current.isMoving = true;
  //   },
  //   [canvasRef],
  // );

  React.useLayoutEffect(() => {
    // const { current: canvas } = canvasRef;
    // let startEvent: null | MouseEvent = null;

    const onMouseDown = ({ offsetY, offsetX }) => {
      context?.beginPath();
      refValues.current.startY = offsetY;
      refValues.current.startX = offsetX;
      setDrawState('start');
    };
    const onMouseUp = () => {
      context?.closePath();
      refValues.current.startY = 0;
      refValues.current.startX = 0;

      setDrawState('end');
    };

    canvasRef.current.addEventListener('mousedown', onMouseDown);
    canvasRef.current.addEventListener('mouseup', onMouseUp);

    return () => {
      canvasRef.current.removeEventListener('mousedown', onMouseDown);
      canvasRef.current.removeEventListener('mouseup', onMouseUp);
    };
  }, [canvasRef, historyPush, context]);

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
