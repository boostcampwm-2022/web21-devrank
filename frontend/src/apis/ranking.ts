import { ProgrammingLanguageRankingResponse, RankingPaginationResponse, RankingResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';
import { CUBE_RANK } from '@utils/constants';

interface RequestTopRankingByScoreParams {
  page?: number;
  limit?: number;
  tier?: string;
  username?: string;
}

export const requestTopRankingByScore = async ({
  page = 1,
  limit = 10,
  tier = CUBE_RANK.ALL,
  username = '',
}: RequestTopRankingByScoreParams): Promise<RankingPaginationResponse> => {
  const { data } = await axiosInstance.get('/rankings', {
    params: {
      page,
      limit,
      tier,
      username,
    },
  });

  return data;
};

export const requestTopRankingByRising = async (limit = 3): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/rankings/rise', {
    params: {
      limit,
    },
  });

  return data;
};

export const requestTopRankingByViews = async (limit = 3): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/rankings/views', {
    params: {
      limit,
    },
  });

  return data;
};

interface RequestRankingByUsernameParams {
  username: string;
  limit: number;
}

export const requestRankingByUsername = async ({
  username,
  limit,
}: RequestRankingByUsernameParams): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get(`/rankings/${username}`, {
    params: {
      username,
      limit,
    },
  });

  return data;
};

export const requestProgrammingLanguageRanking = async (limit = 3): Promise<ProgrammingLanguageRankingResponse[]> => {
  const { data } = await axiosInstance.get('/rankings/languages', {
    params: {
      limit,
    },
  });

  return data;
};
