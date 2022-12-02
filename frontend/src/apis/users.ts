import { ProfileUserResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

interface RequestProfilUserParams {
  username: string;
}
export const requestUserInfoByUsername = async ({
  username,
}: RequestProfilUserParams): Promise<ProfileUserResponse> => {
  const { data } = await axiosInstance.get(`/users/${username}`);

  return data;
};
