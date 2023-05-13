import React from 'react';
import { Tool } from './toolType';
import { toolConfigs } from 'src/features/drawing/tools/modules/config';
import styled from '@emotion/styled';
import ColorSwitch from 'src/features/drawing/tools/ColorSwitch';
import { toolState } from 'src/features/drawing/tools/toolState';
import { useRecoilState } from 'recoil';

export function ToolNavigation() {
  const [tool, setTool] = useRecoilState(toolState);
  const onChangeColor = React.useCallback((activeColor, colors) => {
    setTool(prev => ({
      ...prev,
      color: activeColor,
      colors,
    }));
  }, []);

  return (
    <Side>
      <ul>
        {Object.entries(toolConfigs).map(([key, value]) => {
          const isActive = key === tool.activeTool;

          return (
            <li
              key={key}
              className={isActive ? 'active' : ''}
              onClick={() => {
                setTool(curr => ({
                  ...curr,
                  activeTool: key,
                }));
              }}
            >
              <button>{(value as Tool)?.icon ? <img src={value.icon} title={key} /> : key.substr(0, 1)}</button>
            </li>
          );
        })}
      </ul>
      <ColorSwitch colors={tool.colors} onChangeColors={onChangeColor} />
    </Side>
  );
};

const Side = styled.aside`
  height: 100%;
  background: #292c31;

  ul {
    width: 100%;
    margin: 0;

    li {
      width: 50px;
      height: 50px;
      padding: 5px;
      text-align: center;
      line-height: 15px;
      font-size: 11px;
      cursor: pointer;

      button {
        border-radius: 5px;
        vertical-align: middle;
        padding: 10px;
      }

      img {
        width: 100%;
      }

      &.active button {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

