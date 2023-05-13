
import { useHistoryState } from '@odnh/use-history-state';
import { useCallback, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { configSelector } from '../config/configState';
import { ContextState, layerConfig } from './layer/layerState';
import { ID } from '../../types/common';
import { useInterval } from '../../hooks/useInterval';
import { useLayer } from './layer/useLayer';
import { useShortKey } from '../../hooks/useShortKey';

type HistoryType = {
  layerId: ID;
  imageData?: ImageData;
  contextState?: ContextState;
  date?: Date
};

export function useRestoreContext () {
  const configState = useRecoilValue(configSelector);
  const setLayerConfig = useSetRecoilState(layerConfig);

  const [taskRecord, setTaskRecord, taskRecordApi] = useHistoryState<HistoryType>();
  const restoreRecordRef = useRef<HistoryType[]>([]);
  const [{ canvas, id, contextState, isLock }, setLayerState] = useLayer();

  useInterval(clear => {
    const context = canvas.getContext('2d');
    if(context) {
      setTaskRecord({
        layerId: id,
        contextState: contextState,
        imageData: getImageData(),
      });
      clear();
    }
  }, 50);

  
  const getImageData = useCallback(() => {
    return canvas.getContext('2d').getImageData(0, 0, configState.width, configState.height);
  }, [canvas]);
  const renderImageData = useCallback((imageData: ImageData) => {
    canvas.getContext('2d').putImageData(
      imageData,
      0, 0, 0, 0, configState.width, configState.height
    );
  }, [canvas]);
  
  useShortKey(
    { key: 'z', metaKey: true }, 
    () => {
      const context = taskRecordApi.pop();
      
      if (context) {
        restoreRecordRef.current.push(taskRecord);
        setLayerConfig((prev) => ({
          ...prev,
          currentLayerId: context.layerId,
        }));
        setLayerState((prev) => ({
          ...prev,
          contextState: context.contextState,
        }));
        renderImageData(context.imageData);
      }
    }
  );

  useShortKey(
    { key: 'z', metaKey: true, shiftKey: true },
    () => {
      const restoreRecord = restoreRecordRef.current.pop();
      if (restoreRecord) {
        setTaskRecord(restoreRecord);
        setLayerConfig((prev) => ({
          ...prev,
          currentLayerId: restoreRecord.layerId,
        }));
        setLayerState((prev) => ({
          ...prev,
          contextState: restoreRecord.contextState,
        }));
        renderImageData(restoreRecord.imageData);
      }
    }
  );


  useEffect(() => {
    const handler = ({ detail: context }: CustomEvent<CanvasRenderingContext2D>) => {
      if(isLock) {
        return false;
      }

      const imageData = context.getImageData(0, 0, configState.width, configState.height);
      console.log(imageData);
      setTaskRecord({
        imageData,
        layerId: id,
        contextState: contextState,
        date: new Date()
      });
    }; 

    canvas?.addEventListener('contextChange', handler);
    return () => canvas?.removeEventListener('contextChange', handler);
  }, [canvas, isLock, id, contextState, setTaskRecord]);
}