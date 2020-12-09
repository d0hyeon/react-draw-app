import React, { Dispatch } from 'react';
import { Colors, ToolLiteral } from 'src/types/tool';

interface GlobalTools {
  color: string;
  colors: Colors;
  tool: ToolLiteral;
}

type ToolContextValue = [GlobalTools, Dispatch<any>];

const INITIAL_STATE = {
  colors: ['#000', '#fff'],
  tool: 'pen',
  color: '#000',
};

export const toolReducer = (state, { type, payload }) => {
  switch (type) {
    case 'toggleActiveColor':
      return {
        ...state,
        color: state.colors[payload ? 1 : 0],
      };
    case 'setColors':
      return {
        ...state,
        colors: payload,
      };
    case 'setMainColor':
      return {
        ...state,
        color: payload,
        colors: [payload, state.colors[1]],
      };
    case 'setSubColor':
      return {
        ...state,
        colors: [state.colors[0], payload],
      };
    case 'reverseColors':
      return {
        ...state,
        color: state.colors[1],
        colors: [state.colors[1], state.colors[0]],
      };
    case 'setTool':
      return {
        ...state,
        tool: payload,
      };
  }
};

const ToolContext = React.createContext<null | ToolContextValue>(null);
export const ToolProvider = ({ children }) => {
  const toolContextValue = React.useReducer(toolReducer, INITIAL_STATE);
  React.useEffect(() => {
    console.log(toolContextValue[0].color);
  }, [toolContextValue[0]]);
  return (
    <ToolContext.Provider value={toolContextValue}>
      {children}
    </ToolContext.Provider>
  );
};

export default ToolContext;
