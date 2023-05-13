import { css } from '@emotion/core';
import styled from '@emotion/styled';
import React from 'react';
import { useRecoilState } from 'recoil';
import { configSelector } from 'src/features/config/configState';
import { layerConfig, layerEntity } from 'src/features/drawing/layer/layerState';
import { HEADER_HEIGHT } from 'src/constants/layout';
import { useRestoreContext } from 'src/features/drawing/useRestoreContext';
import ToggleInput from '../../components/EditableText';
import { Drawer } from './canvas/Drawer';
import { LayerNavigation } from './layer/LayerNavigation';
import { ToolNavigation } from './tools/ToolNavigation';
import ToolOptionBar from './tools/ToolOptionBar';
import { Viewer } from './canvas/Viewer';

const DrawApp: React.FC = () => {
  const [configState, setConfigState] = useRecoilState(configSelector);
  const [{ currentLayerId, layers }] = useRecoilState(layerConfig);
  const [layerState, setLayerState] = useRecoilState(layerEntity(currentLayerId));
  
  useRestoreContext();

  const onChangeTitle = React.useCallback(
    (title) => {
      setConfigState((prev) => ({
        ...prev,
        title,
      }));
    },
    [setConfigState],
  );

  React.useLayoutEffect(() => {
    const onStrokeChange = ({ detail: context }: CustomEvent<Partial<CanvasRenderingContext2D>>) => {
      setLayerState((prev) => ({
        ...prev,
        contextState: {
          ...prev.contextState,
          ...context,
        },
      }));
    };
    layerState.canvas?.addEventListener('strokeChange', onStrokeChange);

    return () => {
      layerState.canvas?.removeEventListener('strokeChange', onStrokeChange);
    };
  }, [layerState.canvas, setLayerState]);


  return (
    <>
      <Header>
        <h1>
          <ToggleInput defaultValue={configState.title} updateValue={onChangeTitle} />
        </h1>
      </Header>
      <WrapperDiv>
        <ToolOptionBar />
        <div className="layout">
          <ToolNavigation />
          <main>
            <CanvasWrapperDiv width={configState.width} height={configState.height}>
              <div>
                <Drawer />
                {layers.map((layerId, idx) => (
                  <Viewer
                    key={layerId}
                    id={layerId}
                    isCurrent={layerId === currentLayerId}
                    width={configState.width}
                    height={configState.height}
                    css={css({
                      zIndex: layers.length - idx,
                    })}
                  />
                ))}
              </div>
            </CanvasWrapperDiv>
          </main>
          <LayerNavigation />
        </div>
      </WrapperDiv>
    </>
  );
};

const CanvasWrapperDiv = styled.div<{ width: number; height: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-image: url('https://pixlr.com/img/misc/square-bg.png');
  ${({ width, height }) => `
    width: ${width}px;
    height: ${height}px;
  `};

  > div {
    position: relative;
    width: 100%;
    height: 100%;
  }
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  padding: 0 20px;
  background-color: #292c31;
  display: flex;
  align-items: center;
  box-shadow: 0px 1px 1px 0px rgba(255, 255, 255, 0.2);
  z-index: 100;

  h1 {
    color: #fff;
    margin: 0;
    font-size: 20px;

    p {
      margin: 0;
    }
  }
`;

const WrapperDiv = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  padding-top: ${HEADER_HEIGHT}px;
  display: flex;
  flex-direction: column;

  > nav {
    flex: 0 0 auto;
  }

  > .layout {
    flex: 0 0 auto;
    position: relative;
    display: flex;
    justify-content: space-around;
    flex: 1 0 auto;
    width: 100%;
    height: calc(100% - ${HEADER_HEIGHT}px);
    overflow-y: auto;

    aside {
      flex: 0 0 auto;
    }
  }

  main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 30px 0;
    background-color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
  }
`;

export default DrawApp;
