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
import { ID, StrokeEvent } from 'src/types/common';
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

  const [history, setHistory, prevHistory] = useHistoryState<HistoryType>();
  const restoredRef = React.useRef<HistoryType[]>([]);

  React.useLayoutEffect(() => {
    if (layerState.canvas) {
      setHistory({
        layerId: currentLayerId,
        imageData: layerState.canvas.getContext('2d').getImageData(0, 0, configState.width, configState.height),
        contextState: layerState.contextState,
      });
    }
  }, [layerState.canvas]);

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

  const prev = React.useCallback(() => {
    const prevState = prevHistory.pop();

    if (prevState) {
      restoredRef.current = [...restoredRef.current, history];
      setWillChangeLayerId(prevState.layerId);
      if (prevState.imageData) setWillChangeImage(prevState.imageData);
      if (prevState.contextState) setWillChangeContextState(prevState.contextState);
    }
  }, [history]);

  const next = React.useCallback(() => {
    const restoreState = restoredRef.current.pop();
    if (restoreState) {
      setHistory(restoreState);
      setWillChangeLayerId(restoreState.layerId);
      if (restoreState.imageData) setWillChangeImage(restoreState.imageData);
      if (restoreState.contextState) setWillChangeContextState(restoreState.contextState);
    }
  }, []);

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
      setHistory({
        layerId: currentLayerId,
        imageData: image,
        contextState: {
          ...layerState.contextState,
          strokeX: context.strokeX,
          strokeY: context.strokeY,
          strokeWidth: context.strokeWidth,
          strokeHeight: context.strokeHeight,
        },
      });
    },
    [currentLayerId, configState.height, configState.width, layerState],
  );

  const onStrokeChange = React.useCallback(
    ({ detail: context }: CustomEvent<StrokeEvent>) => {
      setLayerState((prev) => ({
        ...prev,
        contextState: {
          ...prev.contextState,
          ...context,
        },
      }));
    },
    [setLayerState],
  );

  React.useLayoutEffect(() => {
    if (!layerState.isLock) {
      layerState.canvas?.addEventListener('contextChange', onContextChange);
      layerState.canvas?.addEventListener('strokeChange', onStrokeChange);

      return () => {
        layerState.canvas?.removeEventListener('contextChange', onContextChange);
        layerState.canvas?.removeEventListener('strokeChange', onStrokeChange);
      };
    }
  }, [onContextChange, onStrokeChange, layerState.canvas, layerState.isLock]);

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
            <CanvasWrapperDiv width={configState.width} height={configState.height}>
              <div>
                <LasterCanvas />
                {layers.map((layerId, idx) => (
                  <Canvas
                    key={layerId}
                    id={layerId}
                    isCurrent={layerId === currentLayerId}
                    width={configState.width}
                    height={configState.height}
                    customCss={css`
                      z-index: ${layers.length - idx};
                    `}
                  />
                ))}
              </div>
            </CanvasWrapperDiv>
          </main>
          <LayerNavigate />
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

export default Draw;
