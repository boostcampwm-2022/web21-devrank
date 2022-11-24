import { RankingResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

export const requestTopRankingByScore = async (count = 20): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/api/ranking', {
    params: {
      count,
    },
  });

  return data;
};

export const requestTopRankingByRising = async (count = 3): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/api/ranking/rise', {
    params: {
      count,
    },
  });

  return data;
};

export const requestTopRankingByViews = async (count = 3): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/api/ranking/views', {
    params: {
      count,
    },
  });

  return data;
};

export const requestRankingByUsername = async (username: string) => {
  const { data } = await axiosInstance.get(`/api/ranking/${username}`);

  return data;
};
