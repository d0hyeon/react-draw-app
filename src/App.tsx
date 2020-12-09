import React from 'react';
import styled from '@emotion/styled';
import Draw from './components/Draw';
import ConfigContext from './components/context/ConfigContext';
import withConfigProvider from './hoc/withConfigProvider';
import ConfigForm from './components/common/ConfigForm';

function App() {
  const [state, dispatch] = React.useContext(ConfigContext);

  const onSubmitCallback = (formData) => {
    dispatch({ type: 'setConfig', ...formData });
  };

  const isInitalized = Object.values(state).every((value) => !!value);

  return (
    <>
      {isInitalized ? (
        <Draw />
      ) : (
        <FormPanel>
          <ConfigForm initialValue={state} onSuccess={onSubmitCallback} />
        </FormPanel>
      )}
    </>
  );
}

const FormPanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default withConfigProvider(App);