import React from 'react';
import styled from '@emotion/styled';

import ColorButton from './ColorButton';
import { Colors } from 'src/types/toolType';

interface Props {
  colors: Colors;
  onChangeColors: (activeColor: string, colors: Colors) => void;
}

const ColorSwitch: React.FC<Props> = ({ colors: _colors, onChangeColors }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [colors, setColors] = React.useState(_colors);

  const onChangeColor = React.useCallback(
    (color, idx) => {
      setColors(idx === 0 ? [color, colors[1]] : [colors[1], color]);
    },
    [colors, onChangeColors],
  );

  React.useEffect(() => {
    onChangeColors(colors[activeIdx], colors);
  }, [colors, activeIdx]);

  return (
    <ColorSwitchWrapper>
      {colors.map((color, idx) => (
        <ColorButton
          className={activeIdx === idx ? 'front' : ''}
          key={idx}
          color={color}
          onChangeColor={(color) => onChangeColor(color, idx)}
          onClickButton={() => {
            if (activeIdx !== idx) {
              setActiveIdx(idx);
              return false;
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
    &:first-of-type {
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
