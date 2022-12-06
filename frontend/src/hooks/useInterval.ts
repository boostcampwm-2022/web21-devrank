import { useEffect, useRef } from 'react';

interface CallbackType {
  (): void;
}

export function useInterval(callback: CallbackType, delay: number) {
  const savedCallback = useRef<CallbackType>();

  useEffect(() => {
    if (callback) {
      savedCallback.current = callback;
    }
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
