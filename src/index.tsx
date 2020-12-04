
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Global, css } from '@emotion/core';
import 'antd/dist/antd.css'; 

const baseCss = css`
  * {
    margin: 0;
    padding: 0;
    list-style: none;
    box-sizing: border-box;

    &:focus {
      // border: 0;
      outline: 0;
    }
  }

  body {
    background-color: #fff;
  }

  ul,
  ol,
  li {
    list-style: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;
  }

  html {
    font-size: 0.625rem;
    font-family: 'SandollNeo', Arial, sans-serif;
    
    @media (max-width:320px){
      font-size: 8px;
    }
  }

  body {
    -webkit-text-size-adjust: none;
  }

  a {
    text-decoration: none;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    vertical-align: middle;
    line-height: 1;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    border: none;
    background-color: transparent;
    outline-width: 0;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  img {
    max-width: 100%;
  }

  input,
  textarea {
    appearance: none;
    color: inherit;
    font-size: inherit;
    font-family: 'SandollNeo', Arial, sans-serif;
    -webkit-border-radius: 0;
    -webkit-appearance: none;
    border: 0;
    border-color: transparent;

    &::placeholder {
      color: #a3a9b1;
    }
  }

  textarea {
    resize: none;
  }
`;


ReactDOM.render(
  <React.StrictMode>
    <Global styles={baseCss}/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

