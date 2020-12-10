import React from 'react';
import styled from '@emotion/styled';
import ToolContext from '../context/ToolContext';
import { toolConfigs } from 'src/constants/tools';

const ToolNavigate = () => {
  const [toolState] = React.useContext(ToolContext);
  const ToolComponent = toolConfigs?.[toolState.tool]?.Navigate;

  if (!ToolComponent) {
    return null;
  }

  return (
    <Navigate>
      <ToolComponent />
    </Navigate>
  );
};

export default ToolNavigate;

const Navigate = styled.nav`
  width: 100%;
  height: 50px;
  padding: 10px;
  background-color: #25282c;
  border-bottom: 1px solid #444;

  * {
    color: #999;
    border-color: #999;
    background-color: transparent;
  }

  > ul,
  > dl {
    display: flex;
    align-items: center;
  }
  dd {
    margin: 0 0 0 10px;
  }

  dl ~ dl,
  li ~ li {
    margin-left: 15px;
  }
`;
