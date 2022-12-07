import { useTheme } from 'styled-components';
import { Serie } from '@nivo/line';
import { DailyInfo, HistoryType } from '@type/common';
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

export const getProfileDescription = (data: ProfileUserResponse) => {
  const { username, tier, score, totalRank, tierRank, primaryLanguages } = data;
  const languageStr = primaryLanguages.join(', ');

  return (
    `${username} / ` +
    `등급: ${tier} / ` +
    `점수: ${score} / ` +
    `전체 등수: ${totalRank} / ` +
    `${tier} 등수: ${tierRank} / ` +
    languageStr
  );
};

export const transToPieChartData = (data: HistoryType) => {
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
      id: 'Pull Request',
      label: 'Pull Request',
      value: data.totalPullRequestContributions,
      color: theme.colors.blue2,
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
  ];
};

export const transToLineChartData = (data: { [key: string]: DailyInfo }): Serie[] => {
  const theme = useTheme();
  const ret = [
    {
      id: 'contribution',
      color: '#558EF8',
      data: Object.entries(data).map(([key, value]) => ({ x: key, y: value.count })),
    },
  ];

  return ret;
};
