import React from 'react';
import styled from '@emotion/styled';
import DrawApp from './components/DrawApp';
import SettingForm from './components/setting/SettingForm';
import { useRecoilState } from 'recoil';
import { configSelector } from './atoms/configState';

function App() {
  const [configState, setConfigState] = useRecoilState(configSelector);

  const onSubmitCallback = React.useCallback((formData) => {
    setConfigState(formData);
  }, []);

  const isInitalized = Object.values(configState).every((value) => !!value);

  return (
    <>
      {isInitalized ? (
        <DrawApp />
      ) : (
        <FormPanel>
          <SettingForm initialValue={configState} onSuccess={onSubmitCallback} />
        </FormPanel>
      )}
    </>
  );
}

export default App;

const FormPanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
