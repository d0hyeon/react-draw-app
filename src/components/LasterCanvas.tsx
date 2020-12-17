import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { layer, layerEntity } from 'src/atoms/layer';
import { tool } from 'src/atoms/tool';
import { toolConfigs } from 'src/constants/tools';
import { configSelector } from 'src/atoms/config';

const LasterCanvas = () => {
  const { currentLayerId } = useRecoilValue(layer);
  const toolState = useRecoilValue(tool);
  const configState = useRecoilValue(configSelector);
  const layerState = useRecoilValue(layerEntity(currentLayerId));

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const curreutTool = toolConfigs[toolState.tool];

  return (
    <>
      <StyledCanvas ref={canvasRef} width={configState.width} height={configState.height} />
      <curreutTool.Component
        id={currentLayerId}
        canvasRef={canvasRef}
        toolState={toolState}
        layerState={layerState}
        width={configState.width}
        height={configState.height}
        {...(curreutTool.props ?? {})}
      />
    </>
  );
};

export default LasterCanvas;

const StyledCanvas = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
`;
