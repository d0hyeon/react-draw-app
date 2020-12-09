import React from 'react';

interface UseHistoryMethods<T> {
  history: T[];
  historyPush: (value: T) => void;
  historyPop: () => T | null;
}

type SetStateCallback<T> = (state: T) => T;
type SetState<T> = (nextState: T | SetStateCallback<T>) => void;

export const useHistoryState = <T>(
  initialState?: T,
): [T, SetState<T>, UseHistoryMethods<T>] => {
  const [state, setState] = React.useState<T>(initialState);
  const historyRef = React.useRef<T[]>([]);

  const historyPush = React.useCallback((value) => {
    historyRef.current.push(value);
    setState(value);
  }, []);
  const historyPop = React.useCallback(() => {
    if (historyRef.current.length > 0) {
      setState(historyRef.current[historyRef.current.length - 1]);
      return historyRef.current.pop();
    }
    return null;
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
      history: historyRef.current,
      historyPush,
      historyPop,
    },
  ];
};
