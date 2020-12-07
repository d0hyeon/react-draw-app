import React from 'react';
import DrawNavigate from './DrawNavigate';
import styled from '@emotion/styled';
import DrawContext from './DrawContext';
import ToggleInput from './common/ToggleInput';
import { HEADER_HEIGHT } from 'src/constants/layout';
import Canvas from './Canvas';


const Draw: React.FC = () => {
  const [state, dispatch] = React.useContext(DrawContext);
  const [tool, setTool] = React.useState('pen');
  const [
    [mainColor, subColor],
    setColors
  ] = React.useState(['#000', '#fff']);

  const canvasRef = React.useRef(null);

  const onChangeTool = React.useCallback((tool) => {
    setTool(tool);
  }, []);

  const onChangeTitle = React.useCallback((title) => {
    dispatch({type: 'setConfig', title});
  }, [dispatch]);

  return (
    <>
      <Header>
        <h1>
          <ToggleInput defaultValue={state.title} updateValue={onChangeTitle}/>
        </h1>
      </Header>
      <Wrapper>
        <DrawNavigate 
          currentTool={tool}
          colors={[mainColor, subColor]}
          setColors={setColors}
          onClickTool={onChangeTool}
        />
        <main>
          <Canvas 
            ref={canvasRef} 
            width={state.width} 
            height={state.height}
            tool={tool}
            color={mainColor}
          /> 
        </main>
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
  box-shadow: 0px 1px 1px 0px rgba(255, 255, 255, .2);
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