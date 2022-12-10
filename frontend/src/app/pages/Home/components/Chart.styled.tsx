import React, { HTMLProps } from 'react';
import { styled } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled(
  ({ name, ...props }: HTMLProps<HTMLDivElement> & { name: string }) => (
    <div {...props} />
  )
)(({ theme: { breakpoints, palette }, name }) => ({
  gridArea: `chart-${name}`,
  backgroundColor: palette.background.paper,
  borderRadius: BORDER_RADIUS,
  paddingTop: '2rem',
  paddingRight: '2rem',
}));
