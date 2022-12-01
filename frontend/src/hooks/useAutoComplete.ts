import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDebounce } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { RankingResponse } from '@type/response';
import { requestRankingByUsername } from '@apis/ranking';
import { AUTO_COMPLETE_LIMIT, KEYBOARD_KEY, SEARCH_DEBOUNCE_DELAY } from '@utils/constants';

interface useAutoCompleteProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  inputReset: () => void;
}

function useAutoComplete({ input, setInput, inputReset }: useAutoCompleteProps) {
  const searchInput = useDebounce({ value: input, delay: SEARCH_DEBOUNCE_DELAY });
  const [focusIdx, setFocusIdx] = useState(-1);

  const { data: searchList } = useQuery<RankingResponse[]>(
    ['search', searchInput],
    () => requestRankingByUsername({ username: searchInput, limit: AUTO_COMPLETE_LIMIT }),
    {
      enabled: searchInput.length > 0 && focusIdx === -1,
      keepPreviousData: searchInput.length > 0,
      cacheTime: 0,
    },
  );

  useEffect(() => {
    if (focusIdx === -1) return;

    if (searchList) {
      setInput(searchList[focusIdx].username);
    }
  }, [focusIdx]);

  const clearFocus = () => {
    setFocusIdx(-1);
  };

  const focusControlHandler = (e: React.KeyboardEvent) => {
    if (!searchList) return;

    const userCount = searchList.length;

    switch (e.key) {
      case KEYBOARD_KEY.ARROW_DOWN:
        setFocusIdx((focusIdx + 1) % userCount);
        break;
      case KEYBOARD_KEY.ARROW_UP:
        setFocusIdx(focusIdx <= 0 ? userCount - 1 : focusIdx - 1);
        break;
      case KEYBOARD_KEY.ESCAPE:
        inputReset();
        clearFocus();
        break;
      default:
        clearFocus();
    }
  };

  return { searchList, focusIdx, clearFocus, focusControlHandler };
}

export default useAutoComplete;
