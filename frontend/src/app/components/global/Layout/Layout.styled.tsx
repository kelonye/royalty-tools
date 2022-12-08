import { styled } from '@mui/material';

export const Container = styled('div')(({ theme: { breakpoints } }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  margin: '0 auto 0',
  width: '75rem',
  borderRadius: '0.5rem',
  height: 'inherit',

  // [breakpoints.down('lg')]: {
  //   width: '100%',
  //   padding: '0 1rem',
  //   marginTop: '3.75rem',
  // },

  // [breakpoints.down('md')]: {
  //   // width: 'auto',
  //   // margin: '0 0.875rem'
  // },
}));
