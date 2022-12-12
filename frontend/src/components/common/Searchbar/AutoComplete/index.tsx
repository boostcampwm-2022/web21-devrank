import { useRouter } from 'next/router';
import AutoComplete from './AutoComplete';
import { useAutoComplete, useInput } from '@hooks';
import { FormEvent } from '@type/common';
import Searchbar from '@components/common/Searchbar';

type SubmitAlign = 'left' | 'right';

interface AutoCompleteSearchbarProps {
  /** input 태그의 type 속성 */
  type: string;
  /** 검색바 placeholder */
  placeholder: string;
  /** 검색바 너비(px 빼고)  Ex 100 */
  width: number;
  /** 검색 버튼 위치 (left | right) */
  submitAlign: SubmitAlign;
  /** 검색 전에 실행할 함수 */
  onBeforeSearch?: () => void;
}

function AutoCompleteSearchbar({
  type = 'text',
  placeholder,
  width,
  submitAlign,
  onBeforeSearch,
}: AutoCompleteSearchbarProps) {
  const { input, setInput, onInputChange, inputReset } = useInput('');
  const { searchList, focusIdx, focusControlHandler } = useAutoComplete({ input, setInput, inputReset });
  const router = useRouter();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (onBeforeSearch) {
      onBeforeSearch();
    }
    router.push(`/profile/${input}`);
    inputReset();
  };

  return (
    <Searchbar
      type={type}
      placeholder={placeholder}
      width={width}
      submitAlign={submitAlign}
      input={input}
      onInputChange={onInputChange}
      onSearch={onSearch}
      onKeyDown={focusControlHandler}
    >
      {searchList && <AutoComplete searchList={searchList} focusIdx={focusIdx} width={width} />}
    </Searchbar>
  );
}

export default AutoCompleteSearchbar;
