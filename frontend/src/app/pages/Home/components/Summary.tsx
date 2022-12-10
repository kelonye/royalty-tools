import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign as royaltiesIcon,
  faReceipt as salesIcon,
} from '@fortawesome/free-solid-svg-icons';

import { useRequest } from '@app/hooks/useRequest';
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
  const { collection, query } = useCoralCube();
  const endpoint = collection ? `/summary/${collection}` : null;
  const { result: summary } = useRequest<SummaryData>(endpoint, query);

  return !summary ? null : (
    <>
      <S.Container name='royalty'>
        <div className='flex flex-grow items-center'>
          <FontAwesomeIcon width={14} icon={royaltiesIcon} />
          <div className='ml-2'>ROYALTIES</div>
        </div>
        <div>
          {!summary.totalPotentialRoyalty
            ? 0
            : formatNumber(
                summary.totalRoyaltyPaid / summary.totalPotentialRoyalty
              )}
          % ({formatPreciseNumber(summary.totalRoyaltyPaid)}/
          {formatPreciseNumber(summary.totalPotentialRoyalty)} SOL) earned
        </div>
      </S.Container>
      <S.Container name='sales'>
        <div className='flex flex-grow items-center'>
          <FontAwesomeIcon width={14} icon={salesIcon} />
          <div className='ml-2'>SALES</div>
        </div>
        <div>
          {!summary.totalSales
            ? 0
            : formatNumber(summary.totalPaidSales / summary.totalSales)}
          % ({summary.totalPaidSales}/{summary.totalSales}) paid sales
        </div>
      </S.Container>
    </>
  );
};

export default Summary;
