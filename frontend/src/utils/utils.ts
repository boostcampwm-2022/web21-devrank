import { useTranslation } from 'next-i18next';
import { useTheme } from 'styled-components';
import { Serie } from '@nivo/line';
import { CubeRankType, DailyInfo, HistoryType, RANK, ScoreHistory } from '@type/common';
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

export const getKSTDateString = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kst_date = new Date(utc + KR_TIME_DIFF);

  return `${kst_date.getFullYear()}-${kst_date.getMonth() + 1}-${kst_date.getDate()}`;
};

export const getProfileDescription = (locale: string, data: ProfileUserResponse) => {
  const { t } = useTranslation();
  const { tier, score, totalRank, tierRank, primaryLanguages } = data;
  const languageStr = primaryLanguages.join(', ');

  return (
    `${t('profile:rank')}: ${tier} / ` +
    `${t('profile:current-score')}: ${score} / ` +
    `${t('profile:total')}: ${totalRank}${getRankingUnit(locale, totalRank)} / ` +
    `${t(`tier:${tier}`)}: ${tierRank}${getRankingUnit(locale, tierRank)} / ` +
    languageStr
  );
};

export const useTransToPieChartData = (data: HistoryType) => {
  const theme = useTheme();

  return [
    {
      id: 'Commit',
      label: 'Commit',
      value: data.totalCommitContributions,
      color: theme.colors.yellow2,
    },
    {
      id: 'Issue',
      label: 'Issue',
      value: data.totalIssueContributions,
      color: theme.colors.red2,
    },
    {
      id: 'Review',
      label: 'Review',
      value: data.totalPullRequestReviewContributions,
      color: theme.colors.purple2,
    },
    {
      id: 'Repository',
      label: 'Repository',
      value: data.totalRepositoryContributions,
      color: theme.colors.green1,
    },
    {
      id: 'Pull Request',
      label: 'Pull Request',
      value: data.totalPullRequestContributions,
      color: theme.colors.blue2,
    },
  ];
};

export const useTransContributionHistoryToLineChartData = (data: { [key: string]: DailyInfo }, tier: RANK): Serie[] => {
  const theme = useTheme();

  return [
    {
      id: 'contribution',
      color: theme.colors[`${tier}2`],
      data: Object.entries(data).map(([key, value]) => ({ x: key, y: value.count })),
    },
  ];
};

export const transScoreHistoryToLineChartData = (data: ScoreHistory[], tier: RANK): Serie[] => {
  const theme = useTheme();

  return [
    {
      id: 'contribution',
      color: theme.colors[`${tier}2`],
      data: data.map((value) => ({ x: getKSTDateString(new Date(value.date)), y: value.score })),
    },
  ];
};

export const getLineChartMinMaxValue = (data: Serie[]) => {
  const values = data[0].data.map((i) => i.y) as number[];
  let min = Math.min(...values);
  min = min <= 100 ? 0 : min - 100;
  const max = Math.max(...values) + 100;

  return { min, max };
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
