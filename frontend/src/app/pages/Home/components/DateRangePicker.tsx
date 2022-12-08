import React from 'react';
import { DateRangePicker as BaseDateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TextField } from '@mui/material';

import { useCoralCube } from '@app/contexts/coral-cube';

import * as S from './DateRangePicker.styled';

const DateRangePicker: React.FC = () => {
  const { dateRange, setDateRange } = useCoralCube();

  return (
    <S.Container>
      <BaseDateRangePicker
        value={dateRange}
        onChange={(newDateRange) => {
          setDateRange(newDateRange);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} InputLabelProps={{ shrink: true }} />
            <div className='mx-2'>to</div>
            <TextField {...endProps} InputLabelProps={{ shrink: true }} />
          </React.Fragment>
        )}
      />
    </S.Container>
  );
};

export default DateRangePicker;
