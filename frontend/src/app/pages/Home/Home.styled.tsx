import { styled } from '@mui/material';

export const Container = styled('div')(({ theme: { breakpoints } }) => ({
  display: 'grid',
  gridTemplateAreas: `
    "summary-royalty summary-sales table"
    "chart chart table"
  `,
  gap: '0.25rem',
  flex: 1,
  gridTemplateRows: '5rem 1fr',
  gridTemplateColumns: '14rem 14rem 1fr',
}));
