import React from 'react';
import styled from '@emotion/styled';
import { toolConfigs } from 'src/components/tools/config';
import { tool } from 'src/atoms/toolState';
import { useRecoilState } from 'recoil';

const ToolNavigate = () => {
  const [toolState] = useRecoilState(tool);
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
