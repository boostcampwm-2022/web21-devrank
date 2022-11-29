import { useCallback, useMemo } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

function useQueryData(queryKey: unknown[]) {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const queryData: any = useMemo(() => queryClient.getQueryData(queryKey), [isFetching, queryClient, queryKey]);

  const removeQueryData = useCallback(() => {
    queryClient.removeQueries(queryKey);
  }, [queryClient, queryKey]);

  const setQueryData = useCallback(
    (data: any) => {
      queryClient.setQueryData(queryKey, data);
    },
    [queryClient, queryKey],
  );

  return { queryData, setQueryData, removeQueryData };
}

export default useQueryData;
