import { useState } from 'react';
import { InputChangeEvent } from '@type/common';

function useInput(initialInput: string) {
  const [input, setInput] = useState(initialInput);

  const onInputChange = (e: InputChangeEvent) => {
    setInput(e.target.value.trim());
  };

  const inputReset = () => {
    setInput('');
  };

  return { input, setInput, onInputChange, inputReset };
}

export default useInput;
