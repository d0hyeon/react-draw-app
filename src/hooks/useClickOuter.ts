import * as React from 'react';

const useClickOuter = <T extends HTMLElement>(
  ref: React.MutableRefObject<T> | Array<React.MutableRefObject<T>>,
  scopeRef?: React.MutableRefObject<HTMLElement>,
) => {
  const [isClick, setIsClick] = React.useState(false);
  const handleClick = (e: MouseEvent) => {
    if (Array.isArray(ref)) {
      for (const { current } of ref) {
        if (!current) {
          return null;
        }
        if (!!current.contains && current.contains(e.target as Node)) {
          return null;
        }
      }
    } else {
      if (!ref.current) {
        return null;
      }
      if (ref.current.contains(e.target as Node)) {
        return null;
      }
    }
    setIsClick(true);
  };

  React.useEffect(() => {
    isClick && setIsClick(false);
  }, [isClick]);

  React.useEffect(() => {
    const eventTargetElement = scopeRef ? scopeRef.current : document;

    if (eventTargetElement) {
      eventTargetElement.addEventListener('click', handleClick);

      return () => {
        eventTargetElement.removeEventListener('click', handleClick);
      };
    }
  }, [ref, scopeRef]);

  return isClick;
};

export default useClickOuter;
