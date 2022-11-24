import { RankingResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

export const requestTopRankingByScore = async (count = 20): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/ranking', {
    params: {
      count,
    },
  });

  return data;
};

export const requestTopRankingByRising = async (count = 3): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/ranking/rise', {
    params: {
      count,
    },
  });

  return data;
};

export const requestTopRankingByViews = async (count = 3): Promise<RankingResponse[]> => {
  const { data } = await axiosInstance.get('/ranking/views', {
    params: {
      count,
    },
  });

  return data;
};

export const requestRankingByUsername = async (username: string) => {
  const { data } = await axiosInstance.get(`/ranking/${username}`);

  return data;
};
