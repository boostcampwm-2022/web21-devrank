import Image from 'next/image';
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
  const iconImgSrc = languageToURL(language.toLocaleLowerCase());
  return <Image src={iconImgSrc} alt={`${language}`} width={width} height={height} quality={100} />;
}

export default LanguageIcon;
