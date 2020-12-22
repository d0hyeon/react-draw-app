import React from 'react';
import styled from '@emotion/styled';
import useSwipe from '@odnh/use-swipe';
import { ToolComponentProps } from 'src/types/tool';
import useClickOuter from 'src/hooks/useClickOuter';
import { StrokeEvent } from 'src/types/common';
import { useKeyPress } from '@odnh/use-key-press';

const Selector: React.FC<ToolComponentProps> = ({ canvasRef, layerState, width, height }) => {
  const [isSelected, setIsSelected] = React.useState<boolean>(false);
  const prevSwipeRef = React.useRef({ x: 0, y: 0 });
  const selectorRef = React.useRef<HTMLCanvasElement>(null);
  const isClickedOuter = useClickOuter(selectorRef);
  const swipeState = useSwipe(canvasRef);
  const pressingKeyCodes = useKeyPress();
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
    const { contextState } = layerState;
    console.log(contextState);
    setDivProps({
      x: contextState.strokeX,
      y: contextState.strokeY,
      width: contextState.strokeWidth,
      height: contextState.strokeHeight,
    });
  }, [layerState.contextState]);

  const initialSelectorCanvas = React.useCallback(() => {
    if (context) {
      const imageData = context.getImageData(divProps.x, divProps.y, divProps.width, divProps.height);
      const selectorContext = selectorRef.current?.getContext?.('2d');
      selectorContext?.putImageData?.(imageData, 0, 0, 0, 0, divProps.width, divProps.height);
      context.clearRect(0, 0, width, height);
    }
  }, [divProps, selectorRef]);

  React.useEffect(() => {
    if (selectorRef.current && layerState.canvas) {
      initialSelectorCanvas();
      layerState.canvas.addEventListener('strokeChange', initialSelectorCanvas);

      return () => layerState.canvas.removeEventListener('strokeChange', initialSelectorCanvas);
    }
  }, [layerState.canvas, selectorRef]);

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

  React.useEffect(() => {
    if (pressingKeyCodes.includes('Delete') && isSelected) {
      if (pressingKeyCodes.length === 1) {
        context.globalCompositeOperation = 'destination-out';
        context.fillRect(0, 0, width, height);
        context.strokeX = 0;
        context.strokeY = 0;
        context.strokeWidth = 0;
        context.strokeHeight = 0;

        setDivProps((prev) => ({ ...prev, width: 0, height: 0 }));
        setIsSelected(false);

        if (layerState.canvas) {
          const strokeEvent = new CustomEvent<StrokeEvent>('strokeChange', {
            detail: context,
          });
          prevSwipeRef.current = { x: 0, y: 0 };
          const contextEvent = new CustomEvent('contextChange', {
            detail: context,
          });

          layerState.canvas.dispatchEvent(strokeEvent);
          layerState.canvas.dispatchEvent(contextEvent);
        }
      }
    }
  }, [pressingKeyCodes, layerState.canvas, isSelected, width, height]);

  React.useLayoutEffect(() => {
    if (isSelected) {
      if (swipeState.state === 'move') {
        const diffX = swipeState.x - prevSwipeRef.current.x;
        const diffY = swipeState.y - prevSwipeRef.current.y;

        setDivProps((prev) => ({
          ...prev,
          x: prev.x + diffX,
          y: prev.y + diffY,
        }));
        prevSwipeRef.current = {
          x: swipeState.x,
          y: swipeState.y,
        };
      }
    }
  }, [swipeState, isSelected, setDivProps, prevSwipeRef]);

  React.useEffect(() => {
    if (swipeState.state === 'done' && layerState.canvas) {
      const contextEvent = new CustomEvent<StrokeEvent>('contextChange', {
        detail: context,
      });
      layerState.canvas.dispatchEvent(contextEvent);
      prevSwipeRef.current = {
        x: 0,
        y: 0,
      };
    }
  }, [swipeState.state, divProps.x, divProps.y, context, prevSwipeRef, layerState.canvas]);

  return <SelectorCanvas ref={selectorRef} {...divProps} isDisplay={isSelected} onClick={() => setIsSelected(true)} />;
};

interface SelectorCanvasProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isDisplay: boolean;
}

const SelectorCanvas = styled.canvas<SelectorCanvasProps>`
  position: absolute;
  border-color: gray;
  border-width: 0px;
  border-style: solid;
  z-index: 105;
  background-color: #fff;

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
