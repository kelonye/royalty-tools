import React, { FC } from 'react';
import { FormControlLabel, Switch } from '@mui/material';

import { useCoralCube } from '@app/contexts/coral-cube';

const PaidSwitch: FC = () => {
  const { paidSales, togglePaidSales } = useCoralCube();

  return (
    <FormControlLabel
      control={<Switch checked={paidSales} onChange={togglePaidSales} />}
      label='Paid Sales'
    />
  );
};

export default PaidSwitch;
