import Image from 'next/image';
import { LanguageIconProps } from '@type';
import { languageToURL } from '@utils/utils';

function LanguageIcon({ language, width = 50, height = 50 }: LanguageIconProps) {
  const iconImgSrc = languageToURL(language.toLocaleLowerCase());
  return <Image src={iconImgSrc} alt={`${language}`} width={width} height={height} quality={100} />;
}

export default LanguageIcon;
