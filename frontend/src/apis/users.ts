import { ProfileUserResponse, UserByPrefixResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

interface RequestProfilUserParams {
  method: 'get' | 'patch';
  username: string;
}

interface requestUserListByPrefixParams {
  limit?: number;
  username?: string;
}

export const requestUserInfoByUsername = async ({
  username,
  method,
}: RequestProfilUserParams): Promise<ProfileUserResponse> => {
  const { data } = await axiosInstance.request({ method, url: `/users/${username}` });

  return data;
};

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
