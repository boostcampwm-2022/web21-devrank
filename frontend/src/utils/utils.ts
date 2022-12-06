import { useTranslation } from 'next-i18next';
import { ProfileUserResponse } from '@type/response';
import { CUBE_RANK_RANGE, DEVICON_URL, EXCEPTIONAL_LANGUAGE } from '@utils/constants';

export const languageToURL = (language: string): string => {
  if (EXCEPTIONAL_LANGUAGE.includes(language)) {
    return `${DEVICON_URL}${language}/${language}-plain.svg`;
  } else {
    return `${DEVICON_URL}${language}/${language}-original.svg`;
  }
};

export const numberCompactFormatter = (num: number): string => {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
};

export const getTierFromExp = (exp: number) => {
  switch (true) {
    case exp >= CUBE_RANK_RANGE['yellow'][0] && exp < CUBE_RANK_RANGE['yellow'][1]:
      return 'yellow';
    case exp >= CUBE_RANK_RANGE['green'][0] && exp < CUBE_RANK_RANGE['green'][1]:
      return 'green';
    case exp >= CUBE_RANK_RANGE['mint'][0] && exp < CUBE_RANK_RANGE['mint'][1]:
      return 'mint';
    case exp >= CUBE_RANK_RANGE['blue'][0] && exp < CUBE_RANK_RANGE['blue'][1]:
      return 'blue';
    case exp >= CUBE_RANK_RANGE['purple'][0] && exp < CUBE_RANK_RANGE['purple'][1]:
      return 'purple';
    case exp >= CUBE_RANK_RANGE['orange'][0] && exp < CUBE_RANK_RANGE['orange'][1]:
      return 'orange';
    default:
      return 'red';
  }
};

export const getDate = (dateString: string) => {
  const newDate = new Date(dateString);
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  const day = newDate.getDay();
  return { year, month, date, day };
};

export const getProfileDescription = (locale: string, data: ProfileUserResponse) => {
  const { t } = useTranslation();
  const { username, tier, score, totalRank, tierRank, primaryLanguages } = data;
  const languageStr = primaryLanguages.join(', ');

  return (
    `${username} / ` +
    `${t('profile:rank')}: ${tier} / ` +
    `${t('profile:current-score')}: ${score} / ` +
    `${t('profile:total')}: ${totalRank}${getRankingUnit(locale, totalRank)} / ` +
    `${t(`tier:${tier}`)}: ${tierRank}${getRankingUnit(locale, tierRank)} / ` +
    languageStr
  );
};
