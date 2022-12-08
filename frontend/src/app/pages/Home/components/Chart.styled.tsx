import { styled } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled('div')(
  ({ theme: { breakpoints, palette } }) => ({
    backgroundColor: palette.background.paper,
    gridArea: 'chart',
    borderRadius: BORDER_RADIUS,
  })
);
