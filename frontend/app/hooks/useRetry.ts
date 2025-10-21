'use client';

import { useCallback } from 'react';

export function useRetry() {
  const retry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      maxRetries = 3,
      delay = 500,
      onRetry?: (attempt: number, maxRetries: number) => void
    ): Promise<T> => {
      let currentAttempt = 0;

      while (currentAttempt <= maxRetries) {
        try {
          return await fn();
        } catch (error) {
          const errorStatus = (error as any)?.request?.status;
          const errorMessage = (error as any)?.message;
          if (
            currentAttempt >= maxRetries ||
            errorMessage === 'canceled' ||
            errorStatus === 400 ||
            errorStatus === 401 ||
            errorStatus === 409
          )
            throw error;

          currentAttempt++;
          if (onRetry) {
            onRetry(currentAttempt, maxRetries);
          }

          await new Promise(res =>
            setTimeout(res, delay * Math.pow(2, currentAttempt - 1))
          );
        }
      }

      throw new Error('Max retries exceeded');
    },
    []
  );

  return { retry };
}
