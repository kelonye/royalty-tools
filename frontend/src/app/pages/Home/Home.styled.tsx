import { styled } from '@mui/material';

export const Container = styled('div')(({ theme: { breakpoints } }) => ({
  display: 'grid',
  gridTemplateAreas: `
    "summary-royalty summary-sales table"
    "chart-sales chart-sales table"
    "chart-markets chart-markets table"
  `,
  gap: '0.25rem',
  flex: 1,
  gridTemplateRows: '7rem 1fr 1fr',
  gridTemplateColumns: '12rem 12rem 1fr',
}));
