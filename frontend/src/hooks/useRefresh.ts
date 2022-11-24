import { useQuery } from '@tanstack/react-query';
import { requestTokenRefresh } from '@apis/auth';

function useRefresh() {
  return useQuery(['user'], requestTokenRefresh, {
    retry: false,
    cacheTime: Infinity,
  });
}

export default useRefresh;
