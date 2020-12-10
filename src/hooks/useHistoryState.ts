import React from 'react';

interface UseHistoryMethods<T> {
  histories: T[];
  historyPush: (value: T) => void;
  historyPop: () => T | null;
  historyDelete: (value: T) => void;
}

type SetStateCallback<T> = (state: T) => T;
type SetState<T> = (nextState: T | SetStateCallback<T>) => void;

export const useHistoryState = <T>(
  initialState?: T,
): [T, SetState<T>, UseHistoryMethods<T>] => {
  const [state, setState] = React.useState<T>(() => initialState);
  const historyRef = React.useRef<T[]>([]);

  const historyPush = React.useCallback((value) => {
    historyRef.current = Array.from(new Set([...historyRef.current, value]));
  }, []);

  const historyPop = React.useCallback(() => {
    if (historyRef.current.length > 0) {
      setState(historyRef.current[historyRef.current.length - 1]);
      return historyRef.current.pop();
    }
    return null;
  }, []);
  const historyDelete = React.useCallback((value: T) => {
    historyRef.current = historyRef.current.filter((item) => item !== value);
  }, []);
  const setStateCallback = React.useCallback(
    (nextValue) => {
      const value =
        typeof nextValue === 'function' ? nextValue(state) : nextValue;
      setState(nextValue);
      historyPush(value);
    },
    [state],
  );

  return [
    state,
    setStateCallback,
    {
      histories: historyRef.current,
      historyPush,
      historyPop,
      historyDelete,
    },
  ];
};
