import React from 'react';
import { SketchPicker } from 'react-color';
import styled from '@emotion/styled';
import useClickOuter from 'src/hooks/useClickOuter';

interface Props {
  defaultColor?: string;
  color?: string;
  onChangeColor: (color: string) => void;
}

const ColorButton: React.FC<Props> = ({
  color,
  defaultColor,
  onChangeColor
}) => {
  const wrapperRef = React.useRef(null);
  const currentColor = color || defaultColor || '#000';
  const isClickedOuteSide = useClickOuter(wrapperRef);
  const [isPickerDisplay, setIsPickerDisplay] = React.useState<boolean>(false);  

  const onChangePicker = React.useCallback(({hex}) => {
    onChangeColor(hex);
  }, [onChangeColor]);  

  React.useEffect(() => {
    if(isClickedOuteSide) {
      setIsPickerDisplay(false);
    }
  }, [isClickedOuteSide]);
  return (
    <Wrapper ref={wrapperRef}>
      <StyledColorButton 
        color={currentColor} 
        onClick={() => setIsPickerDisplay(curr => !curr)}
      >
        {currentColor}
      </StyledColorButton>
      {isPickerDisplay && (
        <div className="layer">
          <SketchPicker
            color={currentColor}
            onChange={onChangePicker}
          />
        </div>
      )}
    </Wrapper>
  )
}

export default React.memo(ColorButton);

const Wrapper = styled.div`
  position: relative;

  .layer {
    position: absolute;
    top: 100%;
    z-index: 1;
  }
`

const StyledColorButton = styled.button<Pick<Props, 'color'>>`
  position: relative;
  width: 20px;
  height: 20px;
  border: 1px solid #ddd;
  background: ${({color}) => color};
  font-size: 0;
`;
