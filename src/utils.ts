import { useEffect, useRef } from 'react';

export const pipe = (...fns: Function[]) => (x: any) =>
  fns.reduce((y, f) => f(y), x);

export const debounce = (func: Function, delay: number) => {
  let inDebounce: number;
  return function(this: Function) {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

export const throttle = (func: Function, limit: number) => {
  let isCalled = false;

  return function(...args: any) {
    if (!isCalled) {
      func(...args);
      isCalled = true;
      setTimeout(function() {
        isCalled = false;
      }, limit);
    }
  };
};

export function useInterval(callback: Function, delay: number) {
  const savedCallback = useRef<Function>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      typeof savedCallback.current !== 'undefined' && savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const highlight = (str: string, hl: string | undefined) => {
  if (!hl) {
    return str;
  }

  if (!str.toLowerCase().includes(hl.toLowerCase())) {
    return str;
  }

  const re = new RegExp(hl, 'gi');
  return str.replace(re, '<span class="hl">$&</span>');
};
