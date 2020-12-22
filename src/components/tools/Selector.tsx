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

  const [canvasStyles, setCanvasStyle] = React.useState(() => ({
    x: strokeX,
    y: strokeY,
    width: layerState.contextState.strokeWidth,
    height: layerState.contextState.strokeHeight,
  }));

  React.useEffect(() => {
    const { contextState } = layerState;

    setCanvasStyle({
      x: contextState.strokeX,
      y: contextState.strokeY,
      width: contextState.strokeWidth,
      height: contextState.strokeHeight,
    });
  }, [layerState.contextState]);

  const initialSelectorCanvas = React.useCallback(
    ({ detail: context }) => {
      if (context) {
        const { strokeX, strokeY, strokeWidth, strokeHeight } = context;
        if (strokeWidth && strokeHeight) {
          const imageData = context.getImageData(strokeX, strokeY, strokeWidth, strokeHeight);
          const selectorContext = selectorRef.current?.getContext?.('2d');
          selectorContext?.putImageData?.(imageData, 0, 0, 0, 0, strokeWidth, strokeHeight);
          context.clearRect(0, 0, width, height);
          console.log('지운당');
        }
      }
    },
    [canvasStyles, selectorRef, width, height],
  );

  const convertImageToLayerState = () => {
    if (selectorRef.current && context) {
      const selectorContext = selectorRef.current.getContext('2d');
      const { x, y, width: canvasWidth, height: canvasHeight } = canvasStyles;
      if (width || height) {
        const imageData = selectorContext.getImageData(0, 0, canvasWidth, canvasHeight);
        context.putImageData(imageData, x, y, 0, 0, canvasWidth, canvasHeight);
        const contextEvent = new CustomEvent<StrokeEvent>('contextChange', {
          detail: context,
        });
        console.log('반영한당');
        layerState.canvas.dispatchEvent(contextEvent);
      }
    }
  };

  React.useLayoutEffect(() => {
    if (layerState.canvas) {
      initialSelectorCanvas({ detail: context });
    }
  }, [layerState.canvas, context]);

  React.useEffect(() => {
    setCanvasStyle((prev) => ({
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

        setCanvasStyle((prev) => ({ ...prev, width: 0, height: 0 }));
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

        setCanvasStyle((prev) => ({
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
  }, [swipeState, isSelected, setCanvasStyle, prevSwipeRef]);

  React.useEffect(() => {
    if (swipeState.state === 'done' && layerState.canvas && prevSwipeRef.current.x && prevSwipeRef.current.y) {
      convertImageToLayerState();
      prevSwipeRef.current = {
        x: 0,
        y: 0,
      };
    }
  }, [swipeState.state, convertImageToLayerState, layerState.canvas]);

  return (
    <SelectorCanvas ref={selectorRef} {...canvasStyles} isDisplay={isSelected} onClick={() => setIsSelected(true)} />
  );
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
