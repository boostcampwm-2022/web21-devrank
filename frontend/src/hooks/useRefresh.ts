import { useQuery } from '@tanstack/react-query';
import { requestTokenRefresh } from '@apis/auth';

function useRefresh() {
  useQuery(['user'], requestTokenRefresh, {
    refetchOnMount: false,
    retry: false,
    cacheTime: Infinity,
    onSuccess: (data) => {
      console.log(data);
    },
  });
}

export default useRefresh;
