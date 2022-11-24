import { RankingResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

export const requestTopRankingByScore = async (limit = 20): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/rankings', {
    params: {
      limit,
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
