import React from 'react';

const withContextProvider = (
  Component: React.ComponentType<any>,
  Provider: React.ComponentType,
) => {
  const withProvider = (props) => {
    return (
      <Provider>
        <Component {...props} />
      </Provider>
    );
  };
  withProvider.displayName = 'withProvider';
  return withProvider;
};

export default withContextProvider;
