import { useEffect, useRef } from "react";

type Options = {
  key: KeyboardEvent['key'],
  root?: Element 
} & Partial<Pick<KeyboardEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>>

const DEFAULT_OPTIONS = {
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false
};

export function useShortKey(options: Options, fn: (event: KeyboardEvent) => void): void;
export function useShortKey(fn: (event: KeyboardEvent) => void): void;

export function useShortKey (...arg) {
  const optionsRef = useRef<Options | null>(null);
  const callbackRef = useRef(null);
  
  useEffect(() => {
    optionsRef.current = arg.length === 1 ? null : arg[0];
    callbackRef.current = arg.length === 1 ? arg[0] : arg[1];
  }, [arg, callbackRef, optionsRef]);
  
  useEffect(() => {
    const options = optionsRef?.current;
    const target = options?.root ?? window;

    const handler = (event: KeyboardEvent) => {
      if(options?.key != null && event.key !== options?.key) {
        return false;
      }
      const combineOptions = {...DEFAULT_OPTIONS, ...optionsRef.current};
      const isValid = Object.keys(combineOptions).every(key => {
        if(event[key] === combineOptions[key]) {
          return true;
        }
        return false;
      });

      if(!isValid) {
        return false;
      }

      callbackRef.current(event);
    };

    target.addEventListener('keydown', handler);
    
    return () => target.removeEventListener('keydown', handler);
  }, [optionsRef, callbackRef]);  
}