import React from 'react';
import { Chart, ArcElement, Legend, LayoutPosition } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { useCoralCube } from '@app/contexts/coral-cube';
import { useRequest } from '@app/hooks/useRequest';

import * as S from './Chart.styled';

Chart.register(ArcElement, Legend);

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
};

const options = {
  plugins: {
    legend: {
      position: 'right' as LayoutPosition,
      color: '#6e6e6e',
    },
  },
};

const ChartLayout: React.FC = () => {
  const { collection, query } = useCoralCube();
  const endpoint = collection ? `/chart/${collection}` : null;
  const data = useRequest<ChartData>(endpoint, query);

  return (
    <S.Container className='flex justify-center items-center'>
      <div className='h-[300px]'>
        {!data.result ? null : (
          <Pie width={400} height={400} data={data.result} {...{ options }} />
        )}
      </div>
    </S.Container>
  );
};

export default ChartLayout;
