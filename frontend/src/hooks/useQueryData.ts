import { useQueryClient } from '@tanstack/react-query';

function useQueryData(queryKey: unknown[]) {
  const queryClient = useQueryClient();

  const queryData = queryClient.getQueryData(queryKey);

  const removeQueryData = () => {
    queryClient.removeQueries(queryKey);
  };

  const setQueryData = (data: any) => {
    queryClient.setQueryData(queryKey, data);
  };

  return { queryData, setQueryData, removeQueryData };
}

export default useQueryData;
