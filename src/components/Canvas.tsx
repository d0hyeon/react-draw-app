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
    setDeletedImage,
    { pop: deletedImagePop },
  ] = useHistoryState<ImageData>();
  const [
    __,
    setPrevImage,
    { pop: prevImagesPop },
  ] = useHistoryState<ImageData>();

  const pressingKeyCodes = useKeyPress();

  const prev = React.useCallback(() => {
    const context = canvasRef.current.getContext('2d');
    const prevImage = prevImagesPop();

    if (prevImage) {
      setDeletedImage(context.getImageData(0, 0, width, height));
      context.putImageData(prevImage, 0, 0, 0, 0, width, height);
    }
  }, [width, height]);

  const next = React.useCallback(() => {
    const context = canvasRef.current.getContext('2d');
    const deletedImage = deletedImagePop();
    if (deletedImage) {
      setPrevImage(context.getImageData(0, 0, width, height));
      context.putImageData(deletedImage, 0, 0, 0, 0, width, height);
    }
  }, [width, height]);

  React.useEffect(() => {
    if (
      pressingKeyCodes.includes('ControlLeft') &&
      pressingKeyCodes.includes('KeyZ')
    ) {
      if (pressingKeyCodes.includes('ShiftLeft')) {
        next();
      } else {
        prev();
      }
    }
  }, [pressingKeyCodes]);

  const onContextChange = React.useCallback(
    ({ detail: context }: CustomEvent<CanvasRenderingContext2D>) => {
      const image = context.getImageData(0, 0, width, height);
      setPrevImage(image);
    },
    [height, width],
  );

  React.useLayoutEffect(() => {
    // canvasRef.current.addEventListener('contextChange', ()_)
    const canvas = canvasRef.current;
    canvas.addEventListener('contextChange', onContextChange);

    return () => {
      canvas.removeEventListener('contextChange', onContextChange);
    };
  }, [canvasRef, height, width]);

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
        {...(curreutTool.props ?? {})}
      />
    </>
  );
};

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
