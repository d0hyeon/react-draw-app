import React from 'react';
import styled from '@emotion/styled';
import { toolConfigs } from 'src/constants/tools';
import { useHistoryState } from '@odnh/use-history-state';
import { useKeyPress } from '@odnh/use-key-press';
import { useRecoilState } from 'recoil';
import { tool } from 'src/atoms/tool';
import { ID } from 'src/types/common';
import { layerEntity } from 'src/atoms/layer';

interface Props {
  id: ID;
  isCurrent: boolean;
  defaultWidth: number;
  defaultHeight: number;
}

const Canvas: React.FC<Props> = ({
  id,
  isCurrent,
  defaultWidth,
  defaultHeight,
}) => {
  const [toolState] = useRecoilState(tool);
  const [layerState, setLayerState] = useRecoilState(layerEntity(id));
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

  const pressingKeyCodes = useKeyPress('code');

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
    if (layerState.isLock) {
      return;
    }

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
  }, [pressingKeyCodes, layerState]);

  const onContextChange = React.useCallback(
    ({ detail: context }: CustomEvent<CanvasRenderingContext2D>) => {
      if (layerState.isLock) {
        return;
      }
      const image = context.getImageData(0, 0, width, height);
      setPrevImage(image);
    },
    [height, width, layerState],
  );

  React.useLayoutEffect(() => {
    // canvasRef.current.addEventListener('contextChange', ()_)
    if (!layerState.isLock) {
      const canvas = canvasRef.current;
      console.log(layerState.context.background);
      if (layerState.context.background) {
        const context = canvas.getContext('2d');
        const currentFillStyle = context.fillStyle;
        context.fillStyle = layerState.context.background;
        context.fillRect(0, 0, width, height);
        context.fillStyle = currentFillStyle;
      }
      canvas.addEventListener('contextChange', onContextChange);
      return () => {
        canvas.removeEventListener('contextChange', onContextChange);
      };
    }
  }, [canvasRef, height, width, layerState]);

  React.useLayoutEffect(() => {
    setLayerState((prev) => ({
      ...prev,
      canvas: canvasRef.current,
    }));
  }, [canvasRef.current]);

  return (
    <CanvasWrapper isCurrent={isCurrent}>
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
    </CanvasWrapper>
  );
};

const CanvasWrapper = styled.div<Pick<Props, 'isCurrent'>>`
  position: absolute;
  ${({ isCurrent }) => isCurrent && 'z-index: 10000'};

  canvas {
    border: 1px solid #fff;
  }
`;

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
