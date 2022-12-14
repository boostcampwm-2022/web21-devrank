import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => {
    // 응답와서 access token 있으면 Authorization Header에 저장
    const accessToken = res.data.accessToken;
    if (accessToken) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    return res;
  },
  async (err) => {
    const originConfig = err.config;

    // 요청했는데 token 만료면 token refresh 요청
    if (originConfig.url !== '/auth/login' && err.response) {
      if (err.response.status === 401 && err.response.retry) {
        try {
          const { data } = await instance.post('/auth/refresh');
          instance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

          return instance(originConfig);
        } catch (_err) {
          return Promise.reject(_err);
        }
      }
    }

    if (originConfig.url.startsWith('/users/') && originConfig.method === 'patch') {
      return Promise.reject(err);
    }
  },
);

export default instance;
