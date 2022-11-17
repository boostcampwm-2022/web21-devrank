import axiosInstance from '@utils/axiosInstance';

export const requestGithubLogin = async (code: string) => {
  const { data } = await axiosInstance.post('/api/auth/login', {
    code,
  });

  return data;
};
