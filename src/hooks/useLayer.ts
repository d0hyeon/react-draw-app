
import { useRecoilState, useRecoilValue } from 'recoil';
import { layerConfig, layerEntity } from 'src/atoms/layerState';

export function useLayer () {
  const { currentLayerId } = useRecoilValue(layerConfig);
  return useRecoilState(layerEntity(currentLayerId));
}