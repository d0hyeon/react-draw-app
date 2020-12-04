import React from 'react';
import styled from '@emotion/styled';
import Draw from './components/Draw';
import { Config } from './types/common';
import { Form, Input, InputNumber, Row, Button } from 'antd';
import DrawContext, { drawReducer } from './components/DrawContext';
import withDrawProvider from './hoc/withDrawProvider';
import ConfigForm from './components/common/ConfigForm';

const INITIAL_FORM_DATA = {
  width: 900,
  height: 900,
  title: ''
}



function App() {
  const [state, dispatch] = React.useContext(DrawContext);

  const onSubmitCallback = (formData) => {
    dispatch({type: 'setConfig', ...formData});
  }

  const isInitalized = Object.values(state).every(value => !!value);

  return (
    <>
      {isInitalized 
        ? <Draw /> 
        : (
          <FormPanel>
            <ConfigForm 
              initialValue={state}
              onSuccess={onSubmitCallback}
            />
          </FormPanel>
        )
      }
    </>
  );
}

const FormPanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;



export default withDrawProvider(App);
