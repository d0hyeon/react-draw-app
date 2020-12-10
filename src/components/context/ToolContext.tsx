import React, { Dispatch } from 'react';
import { ToolKeys } from 'src/constants/tools';
import { Colors } from 'src/types/tool';

export interface GlobalTools {
  color: string;
  colors: Colors;
  tool: ToolKeys;
  lineWidth: number;
}

type ToolContextValue = [GlobalTools, Dispatch<any>];
const INITIAL_STATE = {
  colors: ['#000', '#fff'],
  tool: 'brash',
  color: '#000',
  lineWidth: 3,
};

export const toolReducer = (state, { type, payload }) => {
  switch (type) {
    case 'patchToolStates':
      return {
        ...state,
        ...payload,
      };
    case 'setCurrentTool':
      return {
        ...state,
        tool: payload,
      };
  }
};

const ToolContext = React.createContext<null | ToolContextValue>(null);
export const ToolProvider = ({ children }) => {
  const toolContextValue = React.useReducer(toolReducer, INITIAL_STATE);

  return (
    <ToolContext.Provider value={toolContextValue}>
      {children}
    </ToolContext.Provider>
  );
};

export default ToolContext;
