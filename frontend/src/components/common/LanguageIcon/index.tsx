import Image from 'next/image';
import { languageToURL } from '@utils/utils';

interface LanguageIconProps {
  language: string;
  width?: number;
  height?: number;
}

function LanguageIcon({ language, width = 50, height = 50 }: LanguageIconProps) {
  const iconImgSrc = languageToURL(language.toLocaleLowerCase());
  return <Image src={iconImgSrc} alt={`${language}`} width={width} height={height} quality={100} />;
}

export default LanguageIcon;
