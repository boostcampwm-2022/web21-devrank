import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDebounce } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { UserByPrefixResponse } from '@type/response';
import { requestUserListByPrefix } from '@apis/users';
import { AUTO_COMPLETE_LIMIT, KEYBOARD_KEY, SEARCH_DEBOUNCE_DELAY } from '@utils/constants';

interface useAutoCompleteProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  inputReset: () => void;
}

const INACTIVE_FOCUS_IDX = -1;

function useAutoComplete({ input, setInput, inputReset }: useAutoCompleteProps) {
  const searchInput = useDebounce({ value: input, delay: SEARCH_DEBOUNCE_DELAY });
  const [focusIdx, setFocusIdx] = useState(INACTIVE_FOCUS_IDX);

  const { data: searchList } = useQuery<UserByPrefixResponse[]>(
    ['search', searchInput],
    () => requestUserListByPrefix({ username: searchInput, limit: AUTO_COMPLETE_LIMIT }),
    {
      enabled: searchInput.length > 0 && focusIdx === INACTIVE_FOCUS_IDX,
      keepPreviousData: searchInput.length > 0,
      cacheTime: 0,
    },
  );

  useEffect(() => {
    if (focusIdx === INACTIVE_FOCUS_IDX) return;

    if (searchList) {
      setInput(searchList[focusIdx].username);
    }
  }, [focusIdx]);

  const clearFocus = () => {
    setFocusIdx(-1);
  };

  const focusControlHandler = (e: React.KeyboardEvent) => {
    if (!searchList || searchList.length === 0) return;

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
