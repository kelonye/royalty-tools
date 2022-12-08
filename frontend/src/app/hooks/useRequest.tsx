import { useState, useMemo, useEffect } from 'react';
import * as qs from 'query-string';

import { sleep } from '@app/utils/promise';

type Status = 'pending' | 'fetching' | 'done';

const API_URL = import.meta.env.VITE_API_URL;

export const DEFAULT_QUERY = {};

export function useRequest<T>(
  endpoint: string | null,
  query: Record<string, any> | null
) {
  const [result, setResult] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>('pending');

  useEffect(() => {
    if (!(endpoint && query)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const load = async () => {
      try {
        const data = (await (
          await fetch(
            `${API_URL}${endpoint}${!query ? '' : `?${qs.stringify(query)}`}`
          )
        ).json()) as T;
        if (isMounted) {
          setResult(data);
        }
      } finally {
        if (isMounted) {
          setStatus('done');
        }
        await sleep(1);
        if (isMounted) {
          setStatus('pending');
        }
      }
    };

    load();

    return () => unsubs.forEach((unsub) => unsub());
  }, [endpoint, query]);

  const working = useMemo(() => status === 'fetching', [status]);

  return {
    result,
    status,
    working,
  };
}
