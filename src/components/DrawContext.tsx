import React, { Dispatch } from 'react';
import { Config, Reducer } from 'src/types/common';

type DrawContextValue = [Config, Dispatch<any>];

const storageConfig = localStorage.getItem('odnh-draw/config') ?? null;
const INITIAL_STATE = {
  title: '',
  width: 0,
  height: 0
}


export const drawReducer = (state, {type, ...payload}) => {
  switch(type) {
    case 'setConfig': 
      const currentData = {...state, ...payload};
      localStorage.setItem('odnh-draw/config', JSON.stringify(currentData));
      return currentData
  }
}


const DrawContext = React.createContext<null | DrawContextValue>(null);
export const DrawProvider = ({ children }) => {
  const drawContextValue = React.useReducer(
    drawReducer, 
    storageConfig 
      ? JSON.parse(storageConfig) 
      : INITIAL_STATE
    );

  return (
    <DrawContext.Provider value={drawContextValue}>
      {children}
    </DrawContext.Provider>
  );
};

export default DrawContext;
