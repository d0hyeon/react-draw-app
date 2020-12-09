import React from 'react';
import { v4 } from 'uuid';
import ToolContext from './context/ToolContext';
import { toolConfigs } from 'src/common/tools';
import { useHistoryState } from 'src/hooks/useHistoryState';

interface Props {
  defaultWidth: number;
  defaultHeight: number;
}

const Canvas: React.FC<Props> = ({ defaultWidth, defaultHeight }) => {
  const [toolState] = React.useContext(ToolContext);

  const id = v4();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const curreutTool = toolConfigs[toolState.tool];
  const body = React.useMemo(() => document.body, []);
  const [[width, height]] = React.useState<[number, number]>([
    defaultWidth,
    defaultHeight,
  ]);

  const [
    _,
    setImage,
    { history, historyPush, historyPop },
  ] = useHistoryState<ImageData>();

  const imageSave = React.useCallback(() => {
    const image = canvasRef.current
      .getContext('2d')
      .getImageData(0, 0, defaultWidth, defaultHeight);
    setImage(image);
  }, [historyPush, defaultHeight, defaultWidth]);

  React.useLayoutEffect(() => {
    let keyCodeStack = [];
    const onKeyDown = (event: KeyboardEvent) => {
      keyCodeStack = Array.from(new Set([...keyCodeStack, event.code]));
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const keyCode = event.code;
      if (
        keyCodeStack.includes('ControlLeft') &&
        keyCodeStack.includes('KeyZ')
      ) {
        const prevImage = historyPop();
        if (prevImage) {
          canvasRef.current
            .getContext('2d')
            .putImageData(prevImage, 0, 0, 0, 0, width, height);
        }
      }
      keyCodeStack = keyCodeStack.filter((code) => code !== keyCode);
    };

    body.addEventListener('keydown', onKeyDown);
    body.addEventListener('keyup', onKeyUp);

    return () => {
      body.removeEventListener('keydown', onKeyDown);
      body.removeEventListener('keyup', onKeyUp);
    };
  }, [history, width, height]);

  return (
    <>
      <canvas
        id={`canvas${id}`}
        ref={canvasRef}
        width={width}
        height={height}
      />
      <curreutTool.Component canvasRef={canvasRef} saveImage={imageSave} />
    </>
  );
};

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
