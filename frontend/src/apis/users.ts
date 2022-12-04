import axiosInstance from '@utils/axiosInstance';
import { UserByPrefixResponse, ProfileUserResponse } from '@type/response';

interface RequestProfilUserParams {
  username: string;
}

interface requestUserListByPrefixParams {
  limit?: number;
  username?: string;
}

export const requestUserInfoByUsername = async ({
  username,
}: RequestProfilUserParams): Promise<ProfileUserResponse> => {
  const { data } = await axiosInstance.get(`/users/${username}`);
  
  return data;
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
