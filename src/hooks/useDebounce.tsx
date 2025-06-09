import { useEffect, useState } from 'react';

export const useDebounce = (
  inputValue: string,
  delay: number = 500,
): string => {
  const [debouncedVal, setDebouncedVal] =
    useState(inputValue);

  useEffect(() => {
    if (!inputValue) {
      setDebouncedVal(inputValue);
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedVal(inputValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [inputValue, delay]);

  return debouncedVal;
};
