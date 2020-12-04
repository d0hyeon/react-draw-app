
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Global } from '@emotion/core';
import { baseCss } from './styles/base';
import 'antd/dist/antd.css'; 

ReactDOM.render(
  <React.StrictMode>
    <Global styles={baseCss}/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

