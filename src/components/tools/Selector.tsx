import React from 'react';
import styled from '@emotion/styled';
import useSwipe from '@odnh/use-swipe';
import { ToolComponentProps } from 'src/types/tool';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tool } from 'src/atoms/tool';
import { configSelector } from 'src/atoms/config';
import { layerEntity } from 'src/atoms/layer';
import useClickOuter from 'src/hooks/useClickOuter';

const Selector: React.FC<ToolComponentProps> = ({ canvasRef, id }) => {
  const toolState = useRecoilValue(tool);
  const configState = useRecoilValue(configSelector);
  const [layerState, setLayerState] = useRecoilState(layerEntity(id));
  const [isSelected, setIsSelected] = React.useState<boolean>(false);
  const prevSwipeRef = React.useRef({ x: 0, y: 0 });
  const divRef = React.useRef(null);
  const isClickedOuter = useClickOuter(divRef);
  const swipeState = useSwipe(canvasRef);
  const context = layerState.canvas?.getContext?.('2d') ?? null;

  const { strokeX, strokeY } = React.useMemo(() => {
    const { strokeX = 0, strokeY = 0 } = layerState.contextState;
    return { strokeX, strokeY };
  }, [layerState.contextState]);

  const [divProps, setDivProps] = React.useState(() => ({
    x: strokeY,
    y: strokeY,
    width: layerState.contextState.strokeWidth,
    height: layerState.contextState.strokeHeight,
  }));

  React.useEffect(() => {
    setDivProps((prev) => ({
      ...prev,
      x: strokeX,
      y: strokeY,
    }));
  }, [strokeX, strokeY]);

  React.useEffect(() => {
    if (isClickedOuter && isSelected) {
      setIsSelected(false);
    }
  }, [isClickedOuter]);

  React.useLayoutEffect(() => {
    if (isSelected) {
      if (swipeState.state === 'move') {
        const image = context.getImageData(0, 0, configState.width, configState.height);
        context.clearRect(0, 0, configState.width, configState.height);

        const diffX = swipeState.x - prevSwipeRef.current.x;
        const diffY = swipeState.y - prevSwipeRef.current.y;

        context.putImageData(image, diffX, diffY);
        prevSwipeRef.current = {
          x: swipeState.x,
          y: swipeState.y,
        };

        context.strokeX = context.strokeX + diffX;
        context.strokeY = context.strokeY + diffY;
        setDivProps((prev) => ({
          ...prev,
          x: prev.x + diffX,
          y: prev.y + diffY,
        }));
      } else {
        prevSwipeRef.current = { x: 0, y: 0 };
        setLayerState((prev) => ({
          ...prev,
          contextState: {
            ...prev.contextState,
            strokeX: context.strokeX,
            strokeY: context.strokeY,
          },
        }));
      }
    }
  }, [swipeState, isSelected, strokeX, strokeY, toolState, configState.width, configState.height]);

  return <SelectDiv ref={divRef} {...divProps} isDisplay={isSelected} onClick={() => setIsSelected(true)} />;
};

interface SelectDivProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isDisplay: boolean;
}

const SelectDiv = styled.div<SelectDivProps>`
  position: absolute;
  border-color: gray;
  border-width: 0px;
  border-style: solid;
  z-index: 105;

  ${(props) => `
    left: ${props.x}px;
    top: ${props.y}px;
    width: ${props.width}px;
    height: ${props.height}px;
    ${
      props.isDisplay &&
      `
      border-width: 1px;
      z-index: 95;
    `
    }
  `}
`;

export const key = 'selector';
export const icon = 'https://img.icons8.com/android/344/ffffff/cursor.png';
export default React.memo(Selector);
