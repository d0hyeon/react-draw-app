import React from 'react';
import { SketchPicker } from 'react-color';
import styled from '@emotion/styled';
import { useClickOuter } from 'src/hooks/useClickOuter';

interface Props {
  className?: string;
  defaultColor?: string;
  color?: string;
  onChangeColor: (color: string) => void;
  onClickButton?: () => void | boolean;
}

const ColorChip: React.FC<Props> = ({
  className = '',
  color,
  defaultColor,
  onChangeColor,
  onClickButton,
}) => {
  const [currentColor, setCurrentColor] = React.useState(
    color || defaultColor || '#000',
  );
  const [isPickerDisplay, setIsPickerDisplay] = React.useState<boolean>(false);

  const onChange = React.useCallback(
    ({ hex }) => {
      setCurrentColor(hex);
    },
    [setCurrentColor],
  );
  const onChangeComplete = React.useCallback(
    ({ hex }) => {
      onChangeColor(hex);
    },
    [onChangeColor],
  );
  const onClickColorChip = React.useCallback(() => {
    if (onClickButton && onClickButton() === false) {
      return;
    }
    setIsPickerDisplay((curr) => !curr);
  }, [onClickButton]);

  const wrapperRef = React.useRef(null);
  useClickOuter(wrapperRef, () => {
    setIsPickerDisplay(false);
  });
  return (
    <Wrapper ref={wrapperRef} className={className}>
      <StyledColorButton color={currentColor} onClick={onClickColorChip}>
        {currentColor}
      </StyledColorButton>
      {isPickerDisplay && (
        <div className="layer">
          <SketchPicker
            color={currentColor}
            onChange={onChange}
            onChangeComplete={onChangeComplete}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default React.memo(ColorChip);

const Wrapper = styled.div`
  position: relative;

  .layer {
    position: absolute;
    top: 100%;
    z-index: 1;
  }
`;

const StyledColorButton = styled.button<Pick<Props, 'color'>>`
  position: relative;
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  background: ${({ color }) => color};
  font-size: 0;
`;
