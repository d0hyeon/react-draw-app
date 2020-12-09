import React from 'react';
import DrawNavigate from './DrawNavigate';
import styled from '@emotion/styled';
import ConfigContext from './context/ConfigContext';
import ToggleInput from './common/ToggleInput';
import { HEADER_HEIGHT } from 'src/constants/layout';
import Canvas from './Canvas';
import { ToolProvider } from './context/ToolContext';

const Draw: React.FC = () => {
  const [config, dispatch] = React.useContext(ConfigContext);

  const onChangeTitle = React.useCallback(
    (title) => {
      dispatch({ type: 'setConfig', title });
    },
    [dispatch],
  );

  return (
    <>
      <Header>
        <h1>
          <ToggleInput
            defaultValue={config.title}
            updateValue={onChangeTitle}
          />
        </h1>
      </Header>
      <Wrapper>
        <ToolProvider>
          <DrawNavigate />
          <main>
            <Canvas defaultWidth={config.width} defaultHeight={config.height} />
          </main>
        </ToolProvider>
      </Wrapper>
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

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #222;

  main {
    height: 100%;
    padding: 30px 0;
    padding-top: ${HEADER_HEIGHT}px;
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
