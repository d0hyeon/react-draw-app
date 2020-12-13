import React from 'react';
import styled from '@emotion/styled';
import Draw from './components/Draw';
import withContextProvider from './hoc/withContextProvider';
import ConfigForm from './components/common/ConfigForm';
import { RecoilRoot, useRecoilState } from 'recoil';
import { configSelector } from './atoms/config';

function App() {
  const [configState, setConfigState] = useRecoilState(configSelector);

  const onSubmitCallback = React.useCallback((formData) => {
    setConfigState(formData);
  }, []);

  const isInitalized = Object.values(configState).every((value) => !!value);

  return (
    <>
      {isInitalized ? (
        <Draw />
      ) : (
        <FormPanel>
          <ConfigForm initialValue={configState} onSuccess={onSubmitCallback} />
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

export default withContextProvider(App, RecoilRoot);
