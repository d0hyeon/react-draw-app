import { atom, selector } from 'recoil';
import { APP_NAME } from 'src/constants/config';
import { Config } from 'src/types/common';

const CONFIG_INITIAL_STATE = {
  title: '',
  width: 900,
  height: 900,
};
const STORAGE_KEY = 'config';
const storageConfig =
  localStorage.getItem(`${APP_NAME}/${STORAGE_KEY}`) ?? null;

const config = atom<Config>({
  key: 'config',
  default: storageConfig ? JSON.parse(storageConfig) : CONFIG_INITIAL_STATE,
});

export const configSelector = selector<Config>({
  key: 'configSelector',
  get: ({ get }) => get(config),
  set: ({ set }, newState) => {
    localStorage.setItem(
      `${APP_NAME}/${STORAGE_KEY}`,
      JSON.stringify(newState),
    );
    set(config, newState);
  },
});
