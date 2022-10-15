
import { useRef, useEffect } from 'react';

export function useInterval (callback: (clear: () => void) => void, ms: number) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callbackRef, callback]);

  useEffect(() => {
    const timerId = setInterval(() => {
      callbackRef.current(() => clearInterval(timerId));
    }, ms);

    return () => clearInterval(timerId);
  }, [ms, callbackRef]);
}