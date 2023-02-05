import styled from '@emotion/styled';
import useSwipe from '@odnh/use-swipe';
import React, { useEffect, useMemo } from 'react';
import { useClickOuter } from 'src/hooks/useClickOuter';
import { useShortKey } from 'src/hooks/useShortKey';
import * as ImageDataWorker from 'src/workers/ImageWorker';
import { ToolComponentProps } from 'src/types/toolType';
import { WorkerUtilKit } from 'src/lib/WorkerUtilKit';
import { StrokeEvent } from 'src/lib/StorkeEvent';

export function Selector ({ canvasRef, layerState, toolState, width, height }: ToolComponentProps) {
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

  const CoordinateWorker = useMemo(() => {
    return WorkerUtilKit.fromModule(ImageDataWorker.getRectCoordinate);
  }, []);
  
  useEffect(() => {
    CoordinateWorker.subscribe(data => {
      const { sx, sw, sy, sh } = data;
      
      setDivProps({
        x: sx - 5,
        y: sy - 5,
        width: sw - sx + 10 + context.lineWidth,
        height: sh - sy + 10 + context.lineWidth,
      });
    });

    return () => {
      CoordinateWorker.terminate();
    };
  }, [CoordinateWorker, setDivProps]);

  React.useEffect(() => {
    if(context) {
      CoordinateWorker.request(context.getImageData(0, 0, height,width));
    }
  }, [context, CoordinateWorker]);

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

  useShortKey({ key: 'Backspace' }, () => {
    if(isSelected) {
      context.globalCompositeOperation = 'destination-out';
      context.fillRect(0, 0, width, height);
      const strokeEvent = new CustomEvent<StrokeEvent>('strokeChange', {
        detail: {
          strokeX: 0,
          strokeY: 0,
          strokeHeight: 0,
          strokeWidth: 0,
        },
      });
      prevSwipeRef.current = { x: 0, y: 0 };
      const contextEvent = new CustomEvent('contextChange', {
        detail: context,
      });

      layerState.canvas.dispatchEvent(strokeEvent);
      layerState.canvas.dispatchEvent(contextEvent);
      setDivProps((prev) => ({ ...prev, width: 0, height: 0 }));
      setIsSelected(false);
    }
  });

  React.useLayoutEffect(() => {
    if (isSelected) {
      if (swipeState.state === 'move') {
        const image = context.getImageData(0, 0, width, height);
        context.clearRect(0, 0, width, height);

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
        const strokeEvent = new CustomEvent<Partial<StrokeEvent>>('strokeChange', {
          detail: {
            strokeX: context.strokeX,
            strokeY: context.strokeY,
          },
        });
        layerState.canvas.dispatchEvent(strokeEvent);
      }
    }
  }, [swipeState, isSelected, strokeX, strokeY, toolState, width, height]);

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
  border-style: dotted;
  z-index: 105;

  ${(props) => `
    left: ${props.x}px;
    top: ${props.y}px;
    width: ${props.width}px;
    height: ${props.height}px;
    ${
      props.isDisplay &&
      `
      border-width: 2px;
      z-index: 95;
    `
    }
  `}
`;


Selector.key = 'selector';
Selector.icon = 'https://img.icons8.com/android/344/ffffff/cursor.png';
