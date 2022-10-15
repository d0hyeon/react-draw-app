import * as React from 'react';

export const useClickOuter = <T extends HTMLElement>(
  ref: React.MutableRefObject<T>,
) => {
  const [isClick, setIsClick] = React.useState(false);
  

  React.useEffect(() => {
    isClick && setIsClick(false);
  }, [isClick]);

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if(event.target === ref.current || (event.target as HTMLElement).contains(ref.current)) {
        return;
      }
      setIsClick(true);
    };
    if(ref.current) {
      document.addEventListener('click', handler);
    }

    return () => ref.current && document.removeEventListener('click', handler);
  }, [ref]);

  return isClick;
};

