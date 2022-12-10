import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign as royaltiesIcon,
  faReceipt as salesIcon,
} from '@fortawesome/free-solid-svg-icons';

import { DEFAULT_QUERY, useRequest } from '@app/hooks/useRequest';
import { useCoralCube } from '@app/contexts/coral-cube';
import { formatNumber, formatPreciseNumber } from '@app/utils/bn';

import * as S from './Summary.styled';

type SummaryData = {
  totalSales: number;
  totalPaidSales: number;
  totalRoyaltyPaid: number;
  totalPotentialRoyalty: number;
};

const Summary: React.FC = () => {
  const { collection } = useCoralCube();
  const endpoint = collection ? `/summary/${collection}` : null;
  const { result: summary } = useRequest<SummaryData>(endpoint, DEFAULT_QUERY);

  return !summary ? null : (
    <>
      <S.Container name='royalty'>
        <div className='flex flex-grow items-center mb-1'>
          <FontAwesomeIcon width={14} icon={royaltiesIcon} />
          <div className='ml-2'>ROYALTIES</div>
        </div>
        <S.Grid>
          <div>earned:</div>
          <div>{formatPreciseNumber(summary.totalRoyaltyPaid)} SOL</div>
          <div>total:</div>
          <div>{formatPreciseNumber(summary.totalPotentialRoyalty)} SOL</div>
          <div>rate:</div>
          <div>
            {!summary.totalPotentialRoyalty
              ? 0
              : formatNumber(
                  summary.totalRoyaltyPaid / summary.totalPotentialRoyalty
                )}
            %
          </div>
        </S.Grid>
      </S.Container>
      <S.Container name='sales'>
        <div className='flex flex-grow items-center mb-1'>
          <FontAwesomeIcon width={14} icon={salesIcon} />
          <div className='ml-2'>SALES</div>
        </div>
        <S.Grid>
          <div>paid:</div>
          <div>{summary.totalPaidSales}</div>
          <div>total:</div>
          <div>{summary.totalSales}</div>
          <div>rate:</div>
          <div>
            {!summary.totalSales
              ? 0
              : formatNumber(summary.totalPaidSales / summary.totalSales)}
            %
          </div>
        </S.Grid>
      </S.Container>
    </>
  );
};

export default Summary;
