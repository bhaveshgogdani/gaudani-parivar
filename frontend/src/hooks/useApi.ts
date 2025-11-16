import { useState, useCallback } from 'react';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

export const useApi = <T = any>(options: UseApiOptions<T> = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiCall();
        setData(result);
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      } catch (err) {
        setError(err);
        if (options.onError) {
          options.onError(err);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

