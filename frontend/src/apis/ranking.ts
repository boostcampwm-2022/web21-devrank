import { CubeRankType } from '@type/common';
import { RankingResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';
import { CUBE_RANK } from '@utils/constants';

interface RequestTopRankingByScoreParams {
  page?: number;
  limit?: number;
  tier?: CubeRankType;
  username?: string;
}

export const requestTopRankingByScore = async ({
  page = 1,
  limit = 10,
  tier = CUBE_RANK.ALL,
  username = '',
}: RequestTopRankingByScoreParams): Promise<RankingResponse[]> => {
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

export const requestRankingByUsername = async (username: string) => {
  const { data } = await axiosInstance.get(`/ranking/${username}`);

  return data;
};
