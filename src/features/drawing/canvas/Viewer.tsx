import React from 'react';
import styled from '@emotion/styled';
import { useRecoilState } from 'recoil';
import { ID } from 'src/types/common';
import { layerEntity } from 'src/features/drawing/layer/layerState';
import { SerializedStyles } from '@emotion/core';

interface Props {
  id: ID;
  isCurrent: boolean;
  width: number;
  height: number;
  css?: SerializedStyles;
}

export function Viewer({ id, isCurrent, width, height, css: customCss }: Props){
  const [layerState, setLayerState] = useRecoilState(layerEntity(id));
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    setLayerState((prev) => ({
      ...prev,
      canvas: canvasRef.current,
    }));
  }, [canvasRef.current]);

  return (
    <CanvasWrapper isCurrent={isCurrent} css={customCss} background={layerState.background}>
      <canvas id={`canvas${id}`} ref={canvasRef} width={width} height={height} />
    </CanvasWrapper>
  );
};

interface StyledProps extends Pick<Props, 'isCurrent' | 'css'> {
  background?: string;
}

const CanvasWrapper = styled.div<StyledProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  ${({ css }) => css}

  canvas {
    border: 1px solid #fff;
    background: ${({ background }) => background || 'transparent'};
  }
`;

