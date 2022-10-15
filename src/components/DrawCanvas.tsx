import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { layerConfig, layerEntity } from 'src/atoms/layerState';
import { tool } from 'src/atoms/toolState';
import { toolConfigs } from 'src/components/tools/config';
import { configSelector } from 'src/atoms/configState';

const DrawCanvas = () => {
  const { currentLayerId } = useRecoilValue(layerConfig);
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

export default DrawCanvas;

const StyledCanvas = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
`;
