
import { useRecoilState, useRecoilValue } from 'recoil';
import { layerConfig, layerEntity } from 'src/features/drawing/layer/layerState';

export function useLayer () {
  const { currentLayerId } = useRecoilValue(layerConfig);
  return useRecoilState(layerEntity(currentLayerId));
}