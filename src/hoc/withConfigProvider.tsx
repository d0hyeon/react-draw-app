import React from 'react';
import { DrawProvider } from 'src/components/context/ConfigContext';

const withDrawProvider = (Component) => {
  const withProvider = () => {
    return (
      <DrawProvider>
        <Component />
      </DrawProvider>
    );
  };
  withProvider.displayName = 'withDrawProvider';
  return withProvider;
};

export default withDrawProvider;
