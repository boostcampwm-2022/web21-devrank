import { UserByPrefixResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

interface requestUserListByPrefixParams {
  limit?: number;
  username?: string;
}

export const requestUserListByPrefix = async ({
  limit,
  username,
}: requestUserListByPrefixParams): Promise<UserByPrefixResponse[]> => {
  const { data } = await axiosInstance.get('/users/prefix', {
    params: {
      limit,
      username,
    },
  });

  return data;
};
