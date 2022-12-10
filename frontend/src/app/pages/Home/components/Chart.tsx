import React from 'react';
import { LineChart, PieChart, BarChart } from 'chartist';

import { useCoralCube } from '@app/contexts/coral-cube';
import { DEFAULT_QUERY, useRequest } from '@app/hooks/useRequest';

import * as S from './Chart.styled';

const COLORS = ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

type ChartData = {
  sales: {
    labels: string[];
    series: number[][];
  };
  markets: {
    labels: string[];
    series: number[];
  };
};

const SALES_CHART_OPTIONS: any = {
  low: 0,
  showArea: true,
  showLine: true,
  showPoint: false,
  fullWidth: true,
  axisX: {
    // type: FixedScaleAxis,
    // divisor: 4,
    // labelInterpolationFnc: function (value: any) {
    //   return moment.unix(value).format('MMM D');
    // },
  },
};

const MARKETS_CHART_OPTIONS: any = {
  labelInterpolationFnc: function (value: number, n: number) {
    return value;
  },
};

const ChartLayout: React.FC = () => {
  const { collection } = useCoralCube();
  const endpoint = collection ? `/chart/${collection}` : null;
  const data = useRequest<ChartData>(endpoint, DEFAULT_QUERY);

  return !data.result ? null : (
    <>
      <S.Container name='sales'>
        <div className='font-bold mb-2 text-primary pl-8'>
          7-Day Sales History
        </div>
        <div>
          <ChartistGraph
            data={data.result.sales}
            options={SALES_CHART_OPTIONS}
            type={'Line'}
          />
        </div>
      </S.Container>
      <S.Container name='markets'>
        <div className='font-bold mb-2 text-primary pl-8'>Market Share</div>
        <div>
          <ChartistGraph
            data={data.result.markets}
            options={MARKETS_CHART_OPTIONS}
            type={'Pie'}
          />
        </div>
      </S.Container>
    </>
  );
};

export default ChartLayout;

const ChartistGraph: React.FC<{
  type: 'Line' | 'Bar' | 'Pie';
  data: any;
  options: any;
  responsiveOptions?: any;
}> = ({ type, data, options, responsiveOptions }) => {
  const el = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (el.current) {
      let chart;
      switch (type) {
        case 'Line':
          chart = new LineChart(el.current, data, options, responsiveOptions);
          break;
        case 'Bar':
          chart = new BarChart(el.current, data, options, responsiveOptions);
          break;
        case 'Pie':
          chart = new PieChart(el.current, data, options, responsiveOptions);
          break;
      }
      if (chart) {
        chart.on('draw', function (data: any) {
          if (data.type === 'line') {
            data.element.attr({
              style: `stroke: ${COLORS[1]}; stroke-width: 2px;`,
            });
          }
          if (data.type === 'area') {
            data.element.attr({
              style: `fill: ${COLORS[1]};`,
            });
          }
          if (data.type === 'grid') {
            data.element.attr({
              style: 'stroke: rgba(255,255,255,.2);',
            });
          }
          if (data.type === 'slice') {
            data.element.attr({
              style: `fill: ${COLORS[data.index]};`,
            });
          }
        });
      }
    }
  }, [type, data, options, responsiveOptions]);

  return <div className='ct-chart' ref={el} />;
};
