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
    setLayerState((prev) => ({
      ...prev,
      canvas: canvasRef.current,
    }));
  }, [canvasRef.current]);

  return (
    <CanvasWrapper isCurrent={isCurrent} customCss={customCss} background={layerState.background}>
      <canvas id={`canvas${id}`} ref={canvasRef} width={width} height={height} />
    </CanvasWrapper>
  );
};

interface StyledProps extends Pick<Props, 'isCurrent' | 'customCss'> {
  background?: string;
}

const CanvasWrapper = styled.div<StyledProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  ${({ customCss }) => customCss}

  canvas {
    border: 1px solid #fff;
    background: ${({ background }) => background || 'transparent'};
  }
`;

Canvas.displayName = 'Canvas';
export default React.memo(Canvas);
