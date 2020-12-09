import React from 'react';
import styled from '@emotion/styled';

import ToolContext from '../context/ToolContext';
import ColorButton from './ColorButton';

const ColorSwitch = () => {
  const [{ colors, color: activeColor }, dispatch] = React.useContext(
    ToolContext,
  );

  const onChangeColorFunc = React.useCallback(
    (idx) => (color) => {
      dispatch({
        type: idx === 0 ? 'setMainColor' : 'setSubColor',
        payload: color,
      });
    },
    [],
  );

  return (
    <ColorSwitchWrapper>
      {colors.map((color, idx) => (
        <ColorButton
          className={activeColor === color ? 'front' : ''}
          key={idx}
          color={color}
          onChangeColor={onChangeColorFunc(idx)}
          onClickButton={() => {
            if (activeColor !== color) {
              dispatch({
                type: 'toggleActiveColor',
                payload: idx,
              });
            }
          }}
        />
      ))}
    </ColorSwitchWrapper>
  );
};

const ColorSwitchWrapper = styled.div`
  margin-top: 10px;
  > * {
    display: inline-block;
    &:first-child {
      transform: translate(5px, -5px);
    }
    &:last-child {
      transform: translate(-5px, 5px);
    }

    &.front {
      z-index: 1;
    }
  }
`;

export default React.memo(ColorSwitch);
