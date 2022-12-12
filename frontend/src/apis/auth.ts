import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { LoginResponse } from '@type/response';
import axiosInstance from '@utils/axiosInstance';

export const requestGithubLogin = async (code: string): Promise<LoginResponse> => {
  const { data } = await axiosInstance.post('/auth/login', {
    code,
  });

  return data;
};

export const requestUserLogout = async () => {
  if (axiosInstance.defaults.headers.common['Authorization']) {
    axiosInstance.defaults.headers.common['Authorization'] = null;
  }
  await axiosInstance.delete('/auth/logout');
};

export const requestTokenRefresh = async (
  context?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
): Promise<LoginResponse | null> => {
  if (context) axiosInstance.defaults.headers.common['Cookie'] = context.req.headers.cookie;

  const response = await axiosInstance.post('/auth/refresh');

  if (!response) return null;

  if (context && response.headers['set-cookie']) context.res.setHeader('Set-Cookie', response.headers['set-cookie']);

  return response.data;
};
