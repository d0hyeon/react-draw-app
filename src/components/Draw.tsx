import React from 'react';
import ToolSide from './layout/ToolSide';
import styled from '@emotion/styled';
import ToggleInput from './common/ToggleInput';
import { HEADER_HEIGHT } from 'src/constants/layout';
import Canvas from './Canvas';
import { ToolProvider } from './context/ToolContext';
import ToolNavigate from './layout/ToolNavigate';
import { configSelector } from 'src/atoms/config';
import { useRecoilState } from 'recoil';

const Draw: React.FC = () => {
  const [configState, setConfigState] = useRecoilState(configSelector);

  const onChangeTitle = React.useCallback(
    (title) => {
      setConfigState((prev) => ({
        ...prev,
        title,
      }));
    },
    [setConfigState],
  );

  return (
    <>
      <Header>
        <h1>
          <ToggleInput
            defaultValue={configState.title}
            updateValue={onChangeTitle}
          />
        </h1>
      </Header>
      <ToolProvider>
        <WrapperDiv>
          <ToolNavigate />
          <div className="layout">
            <ToolSide />
            <main>
              <Canvas
                defaultWidth={configState.width}
                defaultHeight={configState.height}
              />
            </main>
          </div>
        </WrapperDiv>
      </ToolProvider>
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
      background-color: #fff;
    }
  }
`;

export default Draw;
