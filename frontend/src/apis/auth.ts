import { LoginResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

export const requestGithubLogin = async (code: string): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post('/auth/login', {
    code,
  });

  return data;
};

export const requestUserLogout = async () => {
  await axiosInstance.delete('/auth/logout');
};

export const requestTokenRefresh = async (): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post('/auth/refresh');

  return data;
};
