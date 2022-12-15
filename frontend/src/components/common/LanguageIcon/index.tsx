import Image from 'next/image';
import { useState } from 'react';
import { languageToURL } from '@utils/utils';

interface LanguageIconProps {
  /** 프로그래밍 언어 이름 */
  language: string;
  /** 아이콘 가로 크기 */
  width?: number;
  /** 아이콘 세로 크기 */
  height?: number;
}

function LanguageIcon({ language, width = 50, height = 50 }: LanguageIconProps) {
  const transLang = language.toLocaleLowerCase().replaceAll(' ', '');
  const [iconUrl, setIconUrl] = useState(languageToURL(transLang));

  return (
    <div style={{ width, height }}>
      <Image
        src={iconUrl}
        alt={transLang}
        width={width}
        height={height}
        onError={() => setIconUrl('/icons/default-language.svg')}
        title={language}
      />
    </div>
  );
}

export default LanguageIcon;
