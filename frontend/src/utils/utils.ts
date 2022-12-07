import { useTranslation } from 'next-i18next';
import { CubeRankType } from '@type/common';
import { ProfileUserResponse } from '@type/response';
import { CUBE_RANK, DEVICON_URL, EXCEPTIONAL_LANGUAGE } from '@utils/constants';

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

interface QueryValidatorType {
  tier?: string | string[];
  username?: string | string[];
  page?: string | string[];
}

export const queryValidator = ({ tier, username, page }: QueryValidatorType) => {
  if (!tier || !Object.values(CUBE_RANK).includes(tier as CubeRankType)) return false;
  if (!page || page.toString().match(/\D/)) return false;
  return { tier, username: username || '', page: Number(page) };
};

export const getRankingUnit = (locale: string, rank: number) => {
  if (locale === 'ko') return '등';

  const rankFirstUint = rank % 10;
  const rankSecondUint = rank % 100;
  switch (rankSecondUint) {
    case 11:
    case 12:
    case 13:
      return 'th';
    default:
      switch (rankFirstUint) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
  }
};
