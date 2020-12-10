import React from 'react';
import { v4 } from 'uuid';
import ToolContext from './context/ToolContext';
import { toolConfigs } from 'src/constants/tools';
import { useHistoryState } from 'src/hooks/useHistoryState';
import useKeyPress from 'src/hooks/useKeyPress';

interface Props {
  defaultWidth: number;
  defaultHeight: number;
}

const Canvas: React.FC<Props> = ({ defaultWidth, defaultHeight }) => {
  const [toolState] = React.useContext(ToolContext);

  const id = v4();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const curreutTool = toolConfigs[toolState.tool];
  const [[width, height]] = React.useState<[number, number]>([
    defaultWidth,
    defaultHeight,
  ]);

  const [
    _,
    setImage,
    { historyPush, historyPop },
  ] = useHistoryState<ImageData>();

  const imageSave = React.useCallback(() => {
    const image = canvasRef.current
      .getContext('2d')
      .getImageData(0, 0, defaultWidth, defaultHeight);
    setImage(image);
  }, [historyPush, defaultHeight, defaultWidth]);

  const pressingKeyCodes = useKeyPress();

  React.useEffect(() => {
    if (
      pressingKeyCodes.includes('ControlLeft') &&
      pressingKeyCodes.includes('KeyZ')
    ) {
      const prevImage = historyPop();

      if (prevImage) {
        canvasRef.current
          .getContext('2d')
          .putImageData(prevImage, 0, 0, 0, 0, width, height);
      }
    }
  }, [pressingKeyCodes, historyPop]);

  return (
    <>
      <canvas
        id={`canvas${id}`}
        ref={canvasRef}
        width={width}
        height={height}
      />
      <curreutTool.Component
        canvasRef={canvasRef}
        saveImage={imageSave}
        {...(curreutTool.props ?? {})}
      />
    </>
  );
};

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
