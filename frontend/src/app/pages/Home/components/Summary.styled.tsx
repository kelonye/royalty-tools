import React, { HTMLProps } from 'react';
import { styled } from '@mui/material';

import { BORDER_RADIUS } from '@app/config';

export const Container = styled(
  ({ name, ...props }: HTMLProps<HTMLDivElement> & { name: string }) => (
    <div {...props} />
  )
)(({ theme: { breakpoints, palette }, name }) => ({
  gridArea: `summary-${name}`,
  backgroundColor:
    name === 'royalty'
      ? '#bc5090'
      : name === 'sales'
      ? '#58508d'
      : palette.background.paper,
  borderRadius: BORDER_RADIUS,
  padding: '1rem',

  '& > div': {
    '&:nth-of-type(odd)': {
      fontSize: '1rem',
      fontWeight: 600,
    },
    '&:nth-of-type(even)': {
      fontSize: '0.75rem',
      color: '#eee',
    },
  },
}));
