import React from 'react';
import styled from '@emotion/styled';
import { useRecoilState } from 'recoil';
import { ID } from 'src/types/common';
import { layerEntity } from 'src/atoms/layer';
import { SerializedStyles } from '@emotion/core';

interface Props {
  id: ID;
  isCurrent: boolean;
  width: number;
  height: number;
  customCss?: SerializedStyles;
}

const Canvas: React.FC<Props> = ({ id, isCurrent, width, height, customCss }) => {
  const [layerState, setLayerState] = useRecoilState(layerEntity(id));
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    const canvas = layerState.canvas;
    if (canvas && layerState.contextState.background) {
      const context = canvas.getContext('2d');
      const defaultFillStyle = context.fillStyle;
      context.fillStyle = layerState.contextState.background;
      context.fillRect(0, 0, width, height);
      context.fillStyle = defaultFillStyle;
    }
  }, [layerState.contextState.background, layerState.canvas, width, height]);

  React.useLayoutEffect(() => {
    setLayerState((prev) => ({
      ...prev,
      canvas: canvasRef.current,
    }));
  }, [canvasRef.current]);

  return (
    <CanvasWrapper isCurrent={isCurrent} customCss={customCss}>
      <canvas id={`canvas${id}`} ref={canvasRef} width={width} height={height} />
    </CanvasWrapper>
  );
};

const CanvasWrapper = styled.div<Pick<Props, 'isCurrent' | 'customCss'>>`
  position: absolute;
  ${({ customCss }) => customCss}

  canvas {
    border: 1px solid #fff;
  }
`;

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
