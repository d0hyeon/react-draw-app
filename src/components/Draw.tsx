import React from 'react';
import ToolNavigate from './layout/ToolNavigate';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import ToggleInput from './common/ToggleInput';
import { HEADER_HEIGHT } from 'src/constants/layout';
import Canvas from './Canvas';
import ToolOptionBar from './layout/ToolOptionBar';
import { configSelector } from 'src/atoms/config';
import { useRecoilState } from 'recoil';
import { ContextState, layer, layerEntity } from 'src/atoms/layer';
import LayerNavigate from './layout/LayerNavigate';
import LasterCanvas from './LasterCanvas';
import { ID } from 'src/types/common';
import { useHistoryState } from '@odnh/use-history-state';
import { useKeyPress } from '@odnh/use-key-press';

type HistoryType = {
  layerId: ID;
  imageData?: ImageData;
  contextState?: ContextState;
};

const Draw: React.FC = () => {
  const [configState, setConfigState] = useRecoilState(configSelector);
  const [{ currentLayerId, layers }, setLayer] = useRecoilState(layer);
  const [layerState, setLayerState] = useRecoilState(layerEntity(currentLayerId));

  const [willChangeLayerId, setWillChangeLayerId] = React.useState<null | ID>(null);
  const [willChangeImage, setWillChangeImage] = React.useState<null | ImageData>(null);
  const [willChangeContextState, setWillChangeContextState] = React.useState<null | ContextState>(null);

  const [_, setPrevState, prevHistory] = useHistoryState<HistoryType>();
  const [__, setNextState, nextHistory] = useHistoryState<HistoryType>();
  const pressingKeyCodes = useKeyPress();

  const onChangeTitle = React.useCallback(
    (title) => {
      setConfigState((prev) => ({
        ...prev,
        title,
      }));
    },
    [setConfigState],
  );

  const getCurrentStateToHistory = React.useCallback(() => {
    return {
      layerId: currentLayerId,
      imageData: layerState.canvas.getContext('2d').getImageData(0, 0, configState.width, configState.height),
      contextState: layerState.contextState,
    };
  }, [currentLayerId, layerState.canvas, layerState.contextState, configState.width, configState.height]);

  const prev = React.useCallback(() => {
    const state = prevHistory.pop();
    if (state) {
      setNextState(getCurrentStateToHistory());
      setWillChangeLayerId(state.layerId);
      setTimeout(() => {
        if (state.imageData) setWillChangeImage(state.imageData);
        if (state.contextState) setWillChangeContextState(state.contextState);
      }, 0);
    }
  }, [getCurrentStateToHistory]);

  const next = React.useCallback(() => {
    const state = nextHistory.pop();

    if (state) {
      setPrevState(getCurrentStateToHistory());
      setWillChangeLayerId(state.layerId);
      setTimeout(() => {
        if (state.imageData) setWillChangeImage(state.imageData);
        if (state.contextState) setWillChangeContextState(state.contextState);
      }, 0);
    }
  }, [getCurrentStateToHistory]);

  React.useEffect(() => {
    if (pressingKeyCodes.includes('ControlLeft') && pressingKeyCodes.includes('KeyZ')) {
      if (pressingKeyCodes.includes('ShiftLeft')) {
        next();
      } else {
        prev();
      }
    }
  }, [pressingKeyCodes]);

  React.useEffect(() => {
    if (willChangeLayerId) {
      setLayer((prev) => ({
        ...prev,
        currentLayerId: willChangeLayerId,
      }));
      setWillChangeLayerId(null);
    }
  }, [willChangeLayerId]);
  React.useEffect(() => {
    if (willChangeContextState) {
      setLayerState((prev) => ({
        ...prev,
        contextState: {
          ...prev.contextState,
          ...willChangeContextState,
        },
      }));
      setWillChangeContextState(null);
    }
  }, [willChangeContextState]);
  React.useEffect(() => {
    if (willChangeImage) {
      const context = layerState.canvas.getContext('2d');
      context.putImageData(willChangeImage, 0, 0, 0, 0, configState.width, configState.height);
      setWillChangeImage(null);
    }
  }, [willChangeImage, layerState, configState.width, configState.height]);

  const onContextChange = React.useCallback(
    ({ detail: context }: CustomEvent<CanvasRenderingContext2D>) => {
      if (layerState.isLock) {
        return;
      }

      const image = context.getImageData(0, 0, configState.width, configState.height);
      setPrevState({
        layerId: currentLayerId,
        imageData: image,
        contextState: layerState.contextState,
      });
    },
    [currentLayerId, configState.height, configState.width, layerState],
  );

  React.useLayoutEffect(() => {
    if (!layerState.isLock) {
      layerState.canvas?.addEventListener('contextChange', onContextChange);

      return () => {
        layerState.canvas?.removeEventListener('contextChange', onContextChange);
      };
    }
  }, [onContextChange, layerState.canvas, layerState.isLock]);

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
          <ToolNavigate />
          <main>
            <LasterCanvas />
            {layers.map((layerId, idx) => (
              <Canvas
                key={layerId}
                id={layerId}
                isCurrent={layerId === currentLayerId}
                defaultWidth={configState.width}
                defaultHeight={configState.height}
                customCss={css`
                  z-index: ${layers.length - idx};
                `}
              />
            ))}
            <canvas className="background" width={`${configState.width}px`} height={`${configState.height}px`} />
          </main>
          <LayerNavigate />
        </div>
      </WrapperDiv>
    </>
  );
};

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
  display: flex;
  width: 100vw;
  height: 100vh;
  padding-top: ${HEADER_HEIGHT}px;
  flex-direction: column;

  > nav {
    flex: 0 0 auto;
  }

  > .layout {
    position: relative;
    flex: 1 0 auto;
  }

  main {
    height: 100%;
    padding: 30px 0;
    background-color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;

    canvas {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: transparent;

      &.background {
        background-image: url('https://pixlr.com/img/misc/square-bg.png');
        z-index: 0;
      }
    }
  }
`;

export default Draw;
