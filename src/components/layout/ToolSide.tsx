import React from 'react';
import { Tool } from '../../types/tool';
import { toolConfigs } from 'src/constants/tools';
import styled from '@emotion/styled';
import ToolContext from 'src/components/context/ToolContext';
import ColorSwitch from 'src/components/common/ColorSwitch';

const ToolSide: React.FC = () => {
  const [tools, dispatch] = React.useContext(ToolContext);
  const onChangeColor = React.useCallback((activeColor, colors) => {
    dispatch({
      type: 'patchToolStates',
      payload: {
        color: activeColor,
        colors,
      },
    });
  }, []);

  return (
    <Side>
      <ul>
        {Object.entries(toolConfigs).map(([key, value]) => {
          const isActive = key === tools.tool;

          return (
            <li
              key={key}
              className={isActive && 'active'}
              onClick={() => dispatch({ type: 'setCurrentTool', payload: key })}
            >
              <button>
                {(value as Tool)?.icon ? (
                  <img src={value.icon} title={key} />
                ) : (
                  key.substr(0, 1)
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <ColorSwitch colors={tools.colors} onChangeColors={onChangeColor} />
    </Side>
  );
};

const Side = styled.aside`
  position: absolute;
  background: #292c31;
  top: 0;
  left: 0;
  height: 100%;

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

export default ToolSide;
