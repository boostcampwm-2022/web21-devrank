import { useInput } from '@hooks';
import { FormEvent } from '@type/common';
import Searchbar from '@components/common/Searchbar';

interface SearchbarProps {
  /** 검색바 placeholder */
  placeholder: string;
  /** 검색바 너비(px 빼고)  Ex 100 */
  width: number;
  /** 검색폼 제출 핸들러 함수 */
  onSearch: (input: string) => void;
}

function RankingSearchbar({ placeholder, width, onSearch }: SearchbarProps) {
  const { input, onInputChange, inputReset } = useInput('');

  const onSearchHandler = (e: FormEvent) => {
    e.preventDefault();
    onSearch(input);
    inputReset();
  };
  return (
    <Searchbar
      type='text'
      placeholder={placeholder}
      width={width}
      submitAlign='left'
      input={input}
      onInputChange={onInputChange}
      onSearch={onSearchHandler}
    />
  );
}

export default RankingSearchbar;
