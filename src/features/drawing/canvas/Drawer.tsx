import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { layerConfig, layerEntity } from 'src/features/drawing/layer/layerState';
import { toolState } from 'src/features/drawing/tools/toolState';
import { toolConfigs } from 'src/features/drawing/tools/modules/config';
import { configSelector } from 'src/features/config/configState';

export function Drawer () {
  const { currentLayerId } = useRecoilValue(layerConfig);
  
  const configState = useRecoilValue(configSelector);
  const layerState = useRecoilValue(layerEntity(currentLayerId));
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const tool = useRecoilValue(toolState);
  const toolConfig = toolConfigs[tool.activeTool];
  const DrawingTool = toolConfig.Component;

  return (
    <>
      <StyledCanvas ref={canvasRef} width={configState.width} height={configState.height} />
      <DrawingTool
        id={currentLayerId}
        canvasRef={canvasRef}
        toolState={tool}
        layerState={layerState}
        width={configState.width}
        height={configState.height}
        {...(toolConfig.props ?? {})}
      />
    </>
  );
};



const StyledCanvas = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
`;

