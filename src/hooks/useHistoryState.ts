import React from 'react';
import uniq from 'lodash/uniq';

interface History<T> {
  histories: T[];
  pop: () => T | null;
  deleteItem: (value: T) => void;
}

type SetStateCallback<T> = (state: T) => T;
type SetState<T> = (nextState: T | SetStateCallback<T>) => void;

export const useHistoryState = <T>(
  initialState?: T,
): [T, SetState<T>, History<T>] => {
  const [state, setState] = React.useState<T>(() => initialState || null);
  const historyRef = React.useRef<T[]>([]);

  const historyPop = React.useCallback(() => {
    const historyLength = historyRef.current.length;
    if (historyLength > 0) {
      const value = historyRef.current.pop();
      setState(historyRef.current[historyLength - 1]);
      return value;
    }
    return null;
  }, []);
  const historyDelete = React.useCallback(
    (value: T) => {
      const deletedHistories = historyRef.current.filter(
        (item) => item !== value,
      );
      historyRef.current = deletedHistories;
      setState(deletedHistories[deletedHistories.length - 1]);
    },
    [state],
  );
  const setStateCallback = React.useCallback(
    (nextValue) => {
      const value =
        typeof nextValue === 'function' ? nextValue(state) : nextValue;

      historyRef.current = uniq([...historyRef.current, value]);
      setState(value);
    },
    [state],
  );

  return React.useMemo(() => {
    return [
      state,
      setStateCallback,
      {
        histories: historyRef.current,
        pop: historyPop,
        deleteItem: historyDelete,
      },
    ];
  }, [state]);
};
