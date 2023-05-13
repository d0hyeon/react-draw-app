import * as React from 'react';

export const useClickOuter = <T extends HTMLElement>(
  ref: React.MutableRefObject<T>,
  callback?: () => void,
) => {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback, callbackRef]);
  

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if(event.target === ref.current || (event.target as HTMLElement).contains(ref.current)) {
        return;
      }
      callback?.();
    };
    if(ref.current) {
      document.addEventListener('click', handler);
    }

    return () => ref.current && document.removeEventListener('click', handler);
  }, [ref]);

};

