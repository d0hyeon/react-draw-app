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

  const [canvasStyles, setCanvasStyle] = React.useState(() => ({
    x: layerState.contextState.strokeX,
    y: layerState.contextState.strokeY,
    width: layerState.contextState.strokeWidth,
    height: layerState.contextState.strokeHeight,
  }));

  const extractImageFromLayerState = React.useCallback(() => {
    if (context) {
      const { strokeX, strokeY, strokeWidth, strokeHeight } = layerState.contextState;
      if (strokeWidth && strokeHeight) {
        const imageData = context.getImageData(strokeX, strokeY, strokeWidth, strokeHeight);
        const selectorContext = selectorRef.current?.getContext?.('2d');
        selectorContext?.putImageData?.(imageData, 0, 0, 0, 0, strokeWidth, strokeHeight);
      }
    }
  }, [layerState.contextState, context, selectorRef]);
  const extractImageFromLayerStateRef = React.useRef(extractImageFromLayerState);

  React.useEffect(() => {
    extractImageFromLayerStateRef.current = extractImageFromLayerState;
  }, [extractImageFromLayerState]);

  const convertImageToLayerState = React.useCallback(() => {
    if (selectorRef.current && context) {
      const selectorContext = selectorRef.current.getContext('2d');
      const { x, y, width: canvasWidth, height: canvasHeight } = canvasStyles;
      if (canvasWidth || canvasHeight) {
        const imageData = selectorContext.getImageData(0, 0, canvasWidth, canvasHeight);
        context.putImageData(imageData, x, y, 0, 0, canvasWidth, canvasHeight);
      }
    }
  }, [canvasStyles, selectorRef, context]);
  const convertImageToLayerStateRef = React.useRef(convertImageToLayerState);

  React.useEffect(() => {
    convertImageToLayerStateRef.current = convertImageToLayerState;
  }, [convertImageToLayerState]);

  React.useEffect(() => {
    const { strokeX, strokeY, strokeWidth, strokeHeight } = layerState.contextState;

    setCanvasStyle({
      x: strokeX,
      y: strokeY,
      width: strokeWidth,
      height: strokeHeight,
    });
    extractImageFromLayerStateRef.current();
  }, [layerState.contextState]);

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
          const contextEvent = new CustomEvent<CanvasRenderingContext2D>('contextChange', {
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
        context.strokeX = context.strokeX + diffX;
        context.strokeY = context.strokeY + diffY;
        prevSwipeRef.current = {
          x: swipeState.x,
          y: swipeState.y,
        };
      } else {
        if (!!prevSwipeRef.current.x && !!prevSwipeRef.current.y) {
          convertImageToLayerStateRef.current();
          const strokeEvent = new CustomEvent<Partial<StrokeEvent>>('strokeChange', {
            detail: {
              strokeX: context.strokeX,
              strokeY: context.strokeY,
            },
          });
          const contextEvent = new CustomEvent<CanvasRenderingContext2D>('contextChange', {
            detail: context,
          });

          layerState.canvas.dispatchEvent(contextEvent);
          layerState.canvas.dispatchEvent(strokeEvent);
          prevSwipeRef.current = { x: 0, y: 0 };
        } else {
          context.clearRect(0, 0, width, height);
        }
      }
    }
  }, [swipeState, isSelected, setCanvasStyle, prevSwipeRef, context, width, height]);

  React.useLayoutEffect(() => {
    return () => convertImageToLayerStateRef.current();
  }, []);

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
  border: 1px solid transparent;
  box-sizing: content-box;
  z-index: 105;

  ${(props) => `
    left: ${props.x}px;
    top: ${props.y}px;
    width: ${props.width}px;
    height: ${props.height}px;
    ${
      props.isDisplay &&
      `
      border-color: gray;
      z-index: 95;
    `
    }
  `}
`;

export const key = 'selector';
export const icon = 'https://img.icons8.com/android/344/ffffff/cursor.png';
export default React.memo(Selector);
