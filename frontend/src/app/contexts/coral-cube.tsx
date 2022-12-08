import React from 'react';
import moment from 'moment';
import * as qs from 'query-string';
import { useLocation, useNavigate } from 'react-router';
import { DateRange } from '@mui/lab';

import { useRequest, DEFAULT_QUERY } from '@app/hooks/useRequest';

export const COUNT = 15;

const CoralCubeContext = React.createContext<{
  collections: string[] | null;
  collection: string | null;
  setCollection: (collection: string) => void;
  dateRange: DateRange<moment.Moment | null>;
  setDateRange: (dateRange: DateRange<moment.Moment | null>) => void;
  page: number;
  setPage: (page: number) => void;
  query: { [key: string]: string | number | boolean | null };
  paidSales: boolean;
  togglePaidSales: () => void;
} | null>(null);

export const CoralCubeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const { result: collections } = useRequest<string[]>(
    '/collections',
    DEFAULT_QUERY
  );

  const { collection, page, dateRange, paidSales } = React.useMemo(() => {
    const { collection, page, from, to, paid } = qs.parse(search) as {
      collection: string;
      page: string;
      from: string;
      to: string;
      paid: string;
    };
    return {
      collection,
      page: parseInt(page || '1'),
      dateRange: [
        !from ? null : moment(from, 'YYYY-MM-DD'),
        !to ? null : moment(to, 'YYYY-MM-DD'),
      ] as DateRange<moment.Moment | null>,
      paidSales: paid === 'true',
    };
  }, [search]);

  const query = React.useMemo(
    () => ({
      page: page - 1,
      count: COUNT,
      from: formatDate(dateRange[0]),
      to: formatDate(dateRange[1]),
      paid: paidSales,
    }),
    [page, dateRange, paidSales]
  );

  const updateUrl = React.useCallback(
    (params: { [key: string]: string }) => {
      const search = qs.parse(window.location.search);
      navigate('?' + qs.stringify({ ...search, ...params }));
    },
    [navigate]
  );

  const setCollection = React.useCallback(
    (collection: string) => {
      updateUrl({ collection });
    },
    [updateUrl]
  );

  const setPage = React.useCallback(
    (page: number) => {
      updateUrl({ page: page.toString() });
    },
    [updateUrl]
  );

  const setDateRange = React.useCallback(
    (dateRange: DateRange<moment.Moment | null>) => {
      updateUrl({
        from: formatDate(dateRange[0]),
        to: formatDate(dateRange[1]),
      });
    },
    [updateUrl]
  );

  const togglePaidSales = React.useCallback(() => {
    updateUrl({
      paid: (!paidSales).toString(),
    });
  }, [updateUrl, paidSales]);

  React.useEffect(() => {
    if (!collection && collections) {
      setCollection(collections[0]);
    }
  }, [collections, setCollection, collection]);

  return (
    <CoralCubeContext.Provider
      value={{
        collections,
        collection,
        setCollection,
        dateRange,
        setDateRange,
        page,
        setPage,
        query,
        paidSales,
        togglePaidSales,
      }}
    >
      {children}
    </CoralCubeContext.Provider>
  );
};

export function useCoralCube() {
  const context = React.useContext(CoralCubeContext);
  if (!context) {
    throw new Error('Missing CoralCube context');
  }
  return context;
}

function formatDate(m: moment.Moment | null) {
  return !m ? '' : moment(m).format('YYYY-MM-DD');
}
