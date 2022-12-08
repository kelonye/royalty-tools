import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Pagination } from '@mui/lab';
import moment from 'moment';

import { useCoralCube, COUNT } from '@app/contexts/coral-cube';
import { abbrAddr } from '@app/utils/string';
import CopyToClipboard from '@app/components/shared/CopyToClipboard';
import { useRequest } from '@app/hooks/useRequest';
import { formatPreciseNumber } from '@app/utils/bn';

import * as S from './Table.styled';

type Sale = {
  mint: string;
  price: number;
  market_fee: number;
  time: string;
  royalty_fee: number;
  buyer: string;
  seller: string;
  marketplace: string;
  signature: string;
};

const TableLayout: React.FC = () => {
  const { collection, page, setPage, query } = useCoralCube();

  const endpoint = collection ? `/sales/${collection}` : null;

  const data = useRequest<{
    data: Sale[];
    totalCount: number;
  }>(endpoint, query);

  const pages = React.useMemo(
    () => (!data.result ? 1 : Math.ceil(data.result.totalCount / COUNT)),
    [data]
  );

  return (
    <S.Container>
      <TableContainer>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell align='right'>Buyer</TableCell>
              <TableCell align='right'>Price (SOL)</TableCell>
              <TableCell align='right'>Royalty Fee (SOL)</TableCell>
              <TableCell align='right'>Market Fee (SOL)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data.result ? (
              <TableRow>
                <TableCell component='th' scope='row' colSpan={5}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              data.result.data.map((sale) => (
                <TableRow
                  key={sale.signature}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    {moment(sale.time).format('YYYY-MM-DD HH:mm:ss')}
                  </TableCell>
                  <S.AddressTableCell align='right'>
                    <CopyToClipboard text={sale.buyer}>
                      {abbrAddr(sale.buyer)}
                    </CopyToClipboard>
                  </S.AddressTableCell>
                  <TableCell align='right'>
                    {formatPreciseNumber(sale.price)}
                  </TableCell>
                  <TableCell align='right'>
                    {formatPreciseNumber(sale.royalty_fee)}
                  </TableCell>
                  <TableCell align='right'>
                    {formatPreciseNumber(sale.market_fee)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='flex justify-center mt-2 pb-2'>
        <Pagination
          variant='outlined'
          shape='rounded'
          count={pages}
          page={page}
          onChange={(event: any, page: number) => setPage(page)}
        />
      </div>
    </S.Container>
  );
};

export default TableLayout;
