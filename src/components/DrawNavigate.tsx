import React from 'react';
import { Tool } from '../types/tool';
import { TOOL_CONFIG } from 'src/constants/tool';
import styled from '@emotion/styled';
import ColorButton from './common/ColorButton';
import { HEADER_HEIGHT } from 'src/constants/layout';

type Colors = [string, string];
type SetColorCallback = (current: Colors) => Colors;

interface Props {
  currentTool: string;
  colors: Colors;
  setColors: (callback: SetColorCallback) => void;
  onClickTool: (tool: string) => void;
}

const DrawNavigate: React.FC<Props> = ({
  currentTool,
  colors,
  setColors,
  onClickTool
}) => {
  return (
    <Navigate>
      <ul>
        {Object.entries(TOOL_CONFIG).map(([key, value]) => {
          const isActive = key === currentTool;

          return (
            <li 
              key={key}
              className={isActive && 'active'}
              onClick={() => onClickTool(key)}
            >
              <button>
                {(value as Tool)?.icon ? (
                  <img src={value.icon} title={key}/>
                ) : key.substr(0, 1)}
              </button>
            </li>
          );
        })}
      </ul>
      <ColorSwitchWrapper>
        <ColorButton 
          color={colors[0]} 
          onChangeColor={color => {
            setColors(curr => ([color, curr[1]]));
          }} 
        />
        <ColorButton
          color={colors[1]} 
          onChangeColor={color => {
            setColors(curr => ([curr[0], color]));
          }}
        />
      </ColorSwitchWrapper>
    </Navigate>
  );
};


const ColorSwitchWrapper = styled.div`
  margin-top: 10px;
  > * {
    display: inline-block;
    &:first-child {
      transform: translate(5px, -5px);
      z-index: 1;
    }
    &:last-child {
      transform: translate(-5px, 5px);
    }
  }
`;

const Navigate = styled.nav`
  position: absolute;
  background: #292c31;
  top:0;
  left: 0;
  height: 100%;
  padding-top: ${HEADER_HEIGHT}px;

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
        padding: 10px;;
      }

      &.active button {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

export default React.memo(DrawNavigate);