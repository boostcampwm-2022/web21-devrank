import { useEffect } from 'react';

interface CallbackType {
  (): void;
}

export function useInterval(callback: CallbackType, delay: number, isActivate: boolean) {
  useEffect(() => {
    if (!isActivate) return;

    const id = setInterval(callback, delay);

    return () => {
      clearInterval(id);
    };
  }, [callback, delay, isActivate]);
}
