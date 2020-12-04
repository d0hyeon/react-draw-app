import React from 'react';
import DrawNavigate from './DrawNavigate';
import styled from '@emotion/styled';
import DrawContext from './DrawContext';
import ToggleInput from './common/ToggleInput';


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
  }, [dispatch])
  
  const canvas = React.useMemo(() => canvasRef.current, [canvasRef]);
  const ctx = canvas?.getContext('2d') ?? null;

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
          <canvas 
            id="canvas"
            ref={canvasRef}
            height={state.width}
            width={state.height}
          />
        </main>
      </Wrapper>
    </>
  )
}

const Header = styled.header`
  width: 100%;
  height: 50px;
  padding: 0 20px;
  background-color: #333;
  display: flex;
  align-items: center;

  h1 {
    color: #fff;
    margin: 0;
    font-size: 20px;
    
    p {
      margin: 0;
    }
  }  
`

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;

  main {
    height: 100%;
    padding: 30px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;

    canvas {
      background-color: #fff;
    }
  }
`

export default Draw;