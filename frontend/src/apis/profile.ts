import { RankingPaiginationResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

interface RequestTopRankingByScoreParams {
  username: string;
}
export const requestUserInfoByUsername = async ({
  username,
}: RequestTopRankingByScoreParams): Promise<RankingPaiginationResponse> => {
  const { data } = await axiosInstance.get(`/users/${username}`);

  return data;
};
