import React, { Dispatch } from 'react';
import { Config } from 'src/types/common';

type ConfigContextValue = [Config, Dispatch<any>];

const storageConfig = localStorage.getItem('odnh-draw/config') ?? null;
const INITIAL_STATE = {
  title: '',
  width: 0,
  height: 0,
};

export const configReducer = (state, { type, ...payload }) => {
  switch (type) {
    case 'setConfig':
      const currentData = { ...state, ...payload };
      localStorage.setItem('odnh-draw/config', JSON.stringify(currentData));
      return currentData;
  }
};

const ConfigContext = React.createContext<null | ConfigContextValue>(null);
export const DrawProvider = ({ children }) => {
  const configContextValue = React.useReducer(
    configReducer,
    storageConfig ? JSON.parse(storageConfig) : INITIAL_STATE,
  );

  return (
    <ConfigContext.Provider value={configContextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
