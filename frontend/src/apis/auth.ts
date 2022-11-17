import axiosInstance from '@utils/axiosInstance';

export const requestGithubLogin = async (code: string) => {
  const { data } = await axiosInstance.post('/api/auth/login', {
    code,
  });

  return data;
};

export const requestUserLogout = async () => {
  await axiosInstance.delete('/api/auth/logout');
};
