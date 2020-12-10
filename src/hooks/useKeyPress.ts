import React from 'react';
import { useHistoryState } from './useHistoryState';

type Target<T> = HTMLElement | React.MutableRefObject<T>;

const useKeyPress = <T = HTMLElement>(target?: Target<T>): string[] => {
  const [
    keyCode,
    setKeyCode,
    { histories, historyDelete },
  ] = useHistoryState<string>('');

  const onKeyDown = React.useCallback(
    (event) => {
      setKeyCode(event.code);
    },
    [keyCode, histories],
  );

  const onKeyUp = React.useCallback(
    (event) => {
      historyDelete(event.code);
    },
    [histories],
  );

  React.useLayoutEffect(() => {
    const element = target
      ? 'current' in target
        ? target.current
        : target
      : document.body;

    (element as HTMLElement).addEventListener('keydown', onKeyDown);
    (element as HTMLElement).addEventListener('keyup', onKeyUp);

    return () => {
      (element as HTMLElement).removeEventListener('keydown', onKeyDown);
      (element as HTMLElement).removeEventListener('keyup', onKeyUp);
    };
  }, [target]);

  return React.useMemo(() => {
    return histories;
  }, [keyCode]);
};

export default useKeyPress;
